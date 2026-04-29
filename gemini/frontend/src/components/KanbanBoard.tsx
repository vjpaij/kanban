"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useKanban } from "@/context/KanbanContext";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import "./Kanban.css";

export default function KanbanBoard() {
  const { columns, cards, moveCard } = useKanban();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveCardId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) return;

    // Moving between columns
    // We can handle logic here if we were doing sorting, but for simplicity we'll handle drop in dragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    // Is the over element a column?
    const isOverColumn = columns.some((col) => col.id === overId);
    
    moveCard(activeCardId, overId, isOverColumn);
  };

  const activeCard = activeCardId ? cards.find((c) => c.id === activeCardId) : null;

  return (
    <div className="board-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board-columns">
          {columns.map((col) => (
            <KanbanColumn key={col.id} column={col} cards={cards.filter((c) => c.columnId === col.id)} />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? <KanbanCard card={activeCard} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
