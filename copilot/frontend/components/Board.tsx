'use client';

import React from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import Column from '@/components/Column';
import type { Card, Column as ColumnType } from '@/lib/types';

interface BoardProps {
  initialColumns: ColumnType[];
}

export default function Board({ initialColumns }: BoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleAddCard(columnId: string, card: Card) {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId ? { ...column, cards: [card, ...column.cards] } : column
      )
    );
  }

  function handleDeleteCard(columnId: string, cardId: string) {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) } : column
      )
    );
  }

  function handleTitleChange(columnId: string, title: string) {
    setColumns((current) =>
      current.map((column) => (column.id === columnId ? { ...column, title } : column))
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const activeId = event.active.id;
    const card = columns
      .flatMap((column) => column.cards)
      .find((item) => item.id === activeId) ?? null;

    setActiveCard(card);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || active.id === over.id) {
      return;
    }

    const sourceColumnIndex = columns.findIndex((column) => column.cards.some((card) => card.id === active.id));
    const sourceColumn = columns[sourceColumnIndex];
    const targetColumn = columns.find(
      (column) => column.id === over.id || column.cards.some((card) => card.id === over.id)
    );

    if (sourceColumn && targetColumn) {
      const movingCard = sourceColumn.cards.find((card) => card.id === active.id);
      if (!movingCard) return;

      setColumns((current) =>
        current.map((column) => {
          if (column.id === sourceColumn.id) {
            return { ...column, cards: column.cards.filter((card) => card.id !== active.id) };
          }
          if (column.id === targetColumn.id) {
            return { ...column, cards: [movingCard, ...column.cards] };
          }
          return column;
        })
      );
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-6 xl:grid-cols-5">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onTitleChange={handleTitleChange}
          />
        ))}
      </div>
      <DragOverlay>{activeCard ? <div className="rounded-2xl bg-white p-4 shadow-card">{activeCard.title}</div> : null}</DragOverlay>
    </DndContext>
  );
}
