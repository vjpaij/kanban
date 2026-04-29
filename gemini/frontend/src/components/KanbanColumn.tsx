"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useKanban, Column, Card } from "@/context/KanbanContext";
import KanbanCard from "./KanbanCard";

interface Props {
  column: Column;
  cards: Card[];
}

export default function KanbanColumn({ column, cards }: Props) {
  const { renameColumn, addCard } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDetails, setNewCardDetails] = useState("");

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      renameColumn(column.id, title.trim());
    } else {
      setTitle(column.title); // revert
    }
    setIsEditing(false);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      addCard(column.id, newCardTitle.trim(), newCardDetails.trim());
      setNewCardTitle("");
      setNewCardDetails("");
      setIsAddingCard(false);
    }
  };

  return (
    <div 
      className={`column-container ${isOver ? 'column-drag-over' : ''}`}
      ref={setNodeRef}
    >
      <div className="column-header">
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} className="column-rename-form">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              className="column-rename-input"
            />
          </form>
        ) : (
          <div className="column-title-group" onClick={() => setIsEditing(true)}>
            <h2 className="column-title">{column.title}</h2>
            <div className="column-badge">{cards.length}</div>
          </div>
        )}
      </div>

      <div className="column-cards-list">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {isAddingCard ? (
        <form onSubmit={handleAddCardSubmit} className="add-card-form">
          <input
            autoFocus
            placeholder="Card Title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="add-card-input title"
          />
          <textarea
            placeholder="Details (optional)"
            value={newCardDetails}
            onChange={(e) => setNewCardDetails(e.target.value)}
            className="add-card-input details"
            rows={2}
          />
          <div className="add-card-actions">
            <button type="submit" className="btn-primary">Add</button>
            <button type="button" className="btn-cancel" onClick={() => setIsAddingCard(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setIsAddingCard(true)}>
          <Plus size={16} />
          <span>Add Card</span>
        </button>
      )}
    </div>
  );
}
