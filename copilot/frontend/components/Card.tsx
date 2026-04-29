'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import type { Card } from '@/lib/types';

interface CardProps {
  card: Card;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
}

export default function CardItem({ card, columnId, onDelete }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-navy">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-graytext">{card.details}</p>
        </div>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onDelete(columnId, card.id)}
          className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:border-primary hover:text-primary"
          aria-label="Delete card"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
