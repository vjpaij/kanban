'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import CardItem from '@/components/Card';
import NewCardForm from '@/components/NewCardForm';
import type { Card, Column as ColumnType } from '@/lib/types';

interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string, card: Card) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onTitleChange: (columnId: string, title: string) => void;
}

export default function Column({ column, onAddCard, onDeleteCard, onTitleChange }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);

  const containerClasses = [
    'rounded-[2rem] border border-slate-200 bg-slate-50/90 p-5 shadow-card transition',
    isOver ? 'border-primary/70 bg-white' : 'hover:border-slate-300',
  ].join(' ');

  const cards = useMemo(() => column.cards, [column.cards]);

  function handleSubmitTitle() {
    onTitleChange(column.id, titleInput.trim() || column.title);
    setEditingTitle(false);
  }

  function handleAddCard(title: string, details: string) {
    const id = `${column.id}-${Date.now()}`;
    onAddCard(column.id, { id, title, details });
  }

  return (
    <section ref={setNodeRef} className={containerClasses}>
      <div className="mb-5 flex items-start justify-between gap-3">
        {editingTitle ? (
          <div className="flex-1">
            <input
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              onBlur={handleSubmitTitle}
              onKeyDown={(event) => event.key === 'Enter' && handleSubmitTitle()}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-semibold text-navy outline-none focus:border-primary"
              aria-label="Column title"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingTitle(true)}
            className="text-left text-xl font-semibold text-navy transition hover:text-primary"
          >
            {column.title}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {cards.length > 0 ? (
          <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <CardItem key={card.id} card={card} columnId={column.id} onDelete={onDeleteCard} />
            ))}
          </SortableContext>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-graytext">
            Drop cards here or add a new card to get started.
          </div>
        )}
      </div>

      <div className="mt-6">
        <NewCardForm onAdd={handleAddCard} />
      </div>
    </section>
  );
}
