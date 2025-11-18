import React, { useState } from "react";
import { updateCard, deleteCard } from "../api/trello";
import { Draggable } from "@hello-pangea/dnd";

export default function CardItem({ card, index }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(card.name);

  const handleUpdate = async () => {
    try {
      await updateCard(card.id, { name });
      setEditing(false);
      window.location.reload(); // temporary
    } catch (err) {
      console.error("Error updating card:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCard(card.id);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...styles.card,
            ...provided.draggableProps.style
          }}
        >
          {editing ? (
            <div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
              <button onClick={handleUpdate} style={styles.saveButton}>
                Save
              </button>
            </div>
          ) : (
            <>
              <div>{card.name}</div>
              <div style={styles.actions}>
                <button
                  onClick={() => setEditing(true)}
                  style={styles.editButton}
                >
                  ✏️
                </button>
                <button
                  onClick={handleDelete}
                  style={styles.deleteButton}
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "10px",
    borderRadius: "6px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
    position: "relative"
  },
  actions: {
    display: "flex",
    gap: "6px",
    marginTop: "8px"
  },
  editButton: {
    cursor: "pointer",
    border: "none",
    background: "none"
  },
  deleteButton: {
    cursor: "pointer",
    border: "none",
    background: "none"
  },
  input: {
    width: "90%",
    padding: "6px"
  },
  saveButton: {
    marginTop: "4px",
    padding: "6px",
    background: "#5aac44",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};
