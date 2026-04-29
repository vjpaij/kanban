"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { useKanban, Card } from "@/context/KanbanContext";

interface Props {
  card: Card;
  isOverlay?: boolean;
}

export default function KanbanCard({ card, isOverlay }: Props) {
  const { deleteCard } = useKanban();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCard(card.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card-container ${isDragging ? 'card-dragging' : ''} ${isOverlay ? 'card-overlay' : ''}`}
    >
      <div className="card-header">
        <h3 className="card-title">{card.title}</h3>
        <button 
          className="card-delete-btn" 
          onClick={handleDelete}
          aria-label="Delete card"
          onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking delete
        >
          <Trash2 size={14} />
        </button>
      </div>
      {card.details && <p className="card-details">{card.details}</p>}
    </div>
  );
}
