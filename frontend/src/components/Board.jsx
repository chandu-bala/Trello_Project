import React, { useEffect, useState, useCallback } from "react";
import List from "./List";
import { getBoardData, updateCard } from "../api/trello";
import useTrelloSocket from "../hooks/useTrelloSocket";
import { DragDropContext } from "@hello-pangea/dnd";

export default function Board() {
  const boardId = "691ac2028bd518b4d3979c9e";

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load board function reusable
  const fetchBoard = useCallback(async () => {
    try {
      const data = await getBoardData(boardId);
      setLists(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load board:", err);
      setLoading(false);
    }
  }, [boardId]);

  // Initial load
  useEffect(() => {
    const init = async () => await fetchBoard();
    init();
  }, [fetchBoard]);

  // WebSocket listener for real-time refresh
  useTrelloSocket(() => {
    console.log("🔄 Trello event → refreshing board");
    fetchBoard();
  });

  // ⭐ Drag & Drop Handler
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      console.log("📦 Moving card:", draggableId, "→", destination.droppableId);

      await updateCard(draggableId, {
        idList: destination.droppableId,
      });

      fetchBoard();
    } catch (err) {
      console.error("❌ Error moving card:", err);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading board...</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={styles.boardContainer}>
        {lists.map((list) => (
          <List key={list.id} list={list} />
        ))}
      </div>
    </DragDropContext>
  );
}

const styles = {
  boardContainer: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    overflowX: "auto",
    height: "100vh",
    background: "#f4f5f7",
  },
};
