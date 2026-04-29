"use client";

import React, { createContext, useContext, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export type Card = {
  id: string;
  title: string;
  details: string;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
};

export type KanbanState = {
  columns: Column[];
  cards: Card[];
};

type KanbanContextType = {
  columns: Column[];
  cards: Card[];
  renameColumn: (id: string, newTitle: string) => void;
  addCard: (columnId: string, title: string, details: string) => void;
  deleteCard: (id: string) => void;
  moveCard: (activeId: string, overId: string, isOverColumn: boolean) => void;
};

const initialColumns: Column[] = [
  { id: "col-1", title: "To Do" },
  { id: "col-2", title: "In Progress" },
  { id: "col-3", title: "In Review" },
  { id: "col-4", title: "Testing" },
  { id: "col-5", title: "Done" },
];

const initialCards: Card[] = [
  { id: "card-1", title: "Design UI", details: "Create a slick professional UI", columnId: "col-1" },
  { id: "card-2", title: "Set up project", details: "Next.js, Dnd-kit, Vitest", columnId: "col-2" },
  { id: "card-3", title: "Write tests", details: "Unit and E2E testing", columnId: "col-1" },
  { id: "card-4", title: "Review requirements", details: "No persistence, 5 columns", columnId: "col-5" },
];

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [cards, setCards] = useState<Card[]>(initialCards);

  const renameColumn = (id: string, newTitle: string) => {
    setColumns((cols) =>
      cols.map((col) => (col.id === id ? { ...col, title: newTitle } : col))
    );
  };

  const addCard = (columnId: string, title: string, details: string) => {
    // Generate simple ID instead of full UUID for this simple MVP without external dependencies if possible
    // Wait, I didn't install UUID, I'll just use simple Math.random() or Date.now() to avoid extra deps.
    const newCard: Card = {
      id: `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      details,
      columnId,
    };
    setCards((prev) => [...prev, newCard]);
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const moveCard = (activeId: string, overId: string, isOverColumn: boolean) => {
    setCards((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === activeId);
      if (activeIndex === -1) return prev;

      const activeCard = prev[activeIndex];

      if (isOverColumn) {
        if (activeCard.columnId === overId) return prev;
        
        const newCards = [...prev];
        newCards[activeIndex] = { ...activeCard, columnId: overId };
        newCards.push(newCards.splice(activeIndex, 1)[0]);
        return newCards;
      } else {
        const overIndex = prev.findIndex((c) => c.id === overId);
        if (overIndex === -1) return prev;
        
        const overCard = prev[overIndex];
        
        if (activeCard.columnId === overCard.columnId) {
          return arrayMove(prev, activeIndex, overIndex);
        } else {
          const newCards = [...prev];
          newCards.splice(activeIndex, 1);
          const newTargetIndex = newCards.findIndex(c => c.id === overId);
          newCards.splice(newTargetIndex >= 0 ? newTargetIndex : newCards.length, 0, { ...activeCard, columnId: overCard.columnId });
          return newCards;
        }
      }
    });
  };

  return (
    <KanbanContext.Provider
      value={{ columns, cards, renameColumn, addCard, deleteCard, moveCard }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
