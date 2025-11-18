import React, { useState } from "react";
import CardItem from "./CardItem";
import { createCard } from "../api/trello";
import { Droppable } from "@hello-pangea/dnd";

export default function List({ list }) {
  const [newCardName, setNewCardName] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAddCard = async () => {
    if (!newCardName.trim()) return;

    try {
      await createCard({
        boardId: list.idBoard,
        listId: list.id,
        name: newCardName,
        desc: ""
      });

      setNewCardName("");
      setAdding(false);

      window.location.reload(); // temporary, will remove after WebSocket sync
    } catch (err) {
      console.error("Error creating card:", err);
    }
  };

  return (
    <div style={styles.listContainer}>
      <h3 style={styles.title}>{list.name}</h3>

      {/* ⭐ Make card container droppable */}
      <Droppable droppableId={list.id}>
        {(provided) => (
          <div
            style={styles.cardsContainer}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.cards.map((card, index) => (
              <CardItem key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Button */}
      {adding ? (
        <div style={styles.addCardForm}>
          <input
            placeholder="Card title"
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddCard} style={styles.addButton}>
            Add
          </button>
          <button onClick={() => setAdding(false)} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      ) : (
        <button style={styles.addCardButton} onClick={() => setAdding(true)}>
          + Add Card
        </button>
      )}
    </div>
  );
}

const styles = {
  listContainer: {
    width: "280px",
    background: "#ebecf0",
    padding: "12px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column"
  },
  title: {
    margin: 0,
    marginBottom: "10px"
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "10px",
    minHeight: "40px" // helps drag & drop
  },
  addCardButton: {
    background: "none",
    border: "none",
    color: "#3a7bcc",
    cursor: "pointer",
    textAlign: "left",
    padding: "6px"
  },
  addCardForm: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  input: {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  addButton: {
    padding: "6px",
    background: "#5aac44",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none"
  },
  cancelButton: {
    padding: "6px",
    background: "#aaa",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none"
  }
};
