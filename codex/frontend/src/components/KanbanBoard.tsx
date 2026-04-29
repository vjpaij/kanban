"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  addCard,
  Board,
  Card,
  Column,
  createInitialBoard,
  deleteCard,
  moveCard,
  renameColumn,
} from "@/lib/kanban";
import styles from "./KanbanBoard.module.css";

const cardDropPrefix = "card-drop:";

function createCardId() {
  return `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function KanbanBoard() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const activeCard = useMemo(() => {
    if (!activeCardId) {
      return null;
    }

    return (
      board.columns
        .flatMap((column) => column.cards)
        .find((card) => card.id === activeCardId) ?? null
    );
  }, [activeCardId, board.columns]);

  function handleDragEnd(event: DragEndEvent) {
    const cardId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : "";
    const targetCardId = overId.startsWith(cardDropPrefix)
      ? overId.slice(cardDropPrefix.length)
      : undefined;
    const columnId = targetCardId
      ? findColumnIdForCard(board, targetCardId)
      : overId;

    setActiveCardId(null);

    if (!columnId) {
      return;
    }

    setBoard((currentBoard) =>
      moveCard(currentBoard, cardId, columnId, targetCardId, event.delta.y > 0),
    );
  }

  function handleRename(columnId: string, name: string) {
    setBoard((currentBoard) => renameColumn(currentBoard, columnId, name));
  }

  function handleAddCard(columnId: string, card: Omit<Card, "id">) {
    setBoard((currentBoard) =>
      addCard(currentBoard, columnId, { ...card, id: createCardId() }),
    );
  }

  function handleDelete(cardId: string) {
    setBoard((currentBoard) => deleteCard(currentBoard, cardId));
  }

  return (
    <main className={styles.shell}>
      <section className={styles.header} aria-labelledby="board-title">
        <div>
          <p className={styles.eyebrow}>Single board</p>
          <h1 id="board-title">Kanban Board</h1>
        </div>
        <div className={styles.metrics} aria-label="Board summary">
          <span>{board.columns.length} columns</span>
          <span>
            {board.columns.reduce((sum, column) => sum + column.cards.length, 0)}{" "}
            cards
          </span>
        </div>
      </section>

      <DndContext
        sensors={sensors}
        onDragStart={(event) => setActiveCardId(String(event.active.id))}
        onDragCancel={() => setActiveCardId(null)}
        onDragEnd={handleDragEnd}
      >
        <section className={styles.board} aria-label="Kanban board">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onRename={handleRename}
              onAddCard={handleAddCard}
              onDeleteCard={handleDelete}
            />
          ))}
        </section>

        <DragOverlay>
          {activeCard ? (
            <article className={`${styles.card} ${styles.dragOverlay}`}>
              <h3>{activeCard.title}</h3>
              <p>{activeCard.details}</p>
            </article>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}

type KanbanColumnProps = {
  column: Column;
  onRename: (columnId: string, name: string) => void;
  onAddCard: (columnId: string, card: Omit<Card, "id">) => void;
  onDeleteCard: (cardId: string) => void;
};

function KanbanColumn({
  column,
  onRename,
  onAddCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextDetails = details.trim();

    if (!nextTitle || !nextDetails) {
      return;
    }

    onAddCard(column.id, { title: nextTitle, details: nextDetails });
    setTitle("");
    setDetails("");
  }

  return (
    <article
      className={`${styles.column} ${isOver ? styles.columnActive : ""}`}
      ref={setNodeRef}
      data-testid={`column-${column.id}`}
    >
      <header className={styles.columnHeader}>
        <input
          aria-label={`Rename ${column.name || "untitled"} column`}
          className={styles.columnName}
          value={column.name}
          onChange={(event) => onRename(column.id, event.target.value)}
        />
        <span className={styles.count}>{column.cards.length}</span>
      </header>

      <div className={styles.cards}>
        {column.cards.map((card) => (
          <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
        ))}
      </div>

      <form className={styles.addCard} onSubmit={handleSubmit}>
        <input
          aria-label={`Card title for ${column.name}`}
          placeholder="Card title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <textarea
          aria-label={`Card details for ${column.name}`}
          placeholder="Details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />
        <button type="submit">
          <Plus size={16} aria-hidden="true" />
          Add
        </button>
      </form>
    </article>
  );
}

type KanbanCardProps = {
  card: Card;
  onDelete: (cardId: string) => void;
};

function KanbanCard({ card, onDelete }: KanbanCardProps) {
  const { setNodeRef: setDropNodeRef } = useDroppable({
    id: `${cardDropPrefix}${card.id}`,
  });
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: card.id });
  const setCardNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      setDropNodeRef(node);
    },
    [setDropNodeRef, setNodeRef],
  );
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <article
      className={`${styles.card} ${isDragging ? styles.cardDragging : ""}`}
      ref={setCardNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-testid={`card-${card.id}`}
    >
      <div>
        <h3>{card.title}</h3>
        <p>{card.details}</p>
      </div>
      <button
        type="button"
        className={styles.deleteButton}
        aria-label={`Delete ${card.title}`}
        onClick={() => onDelete(card.id)}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </article>
  );
}

function findColumnIdForCard(board: Board, cardId: string) {
  return board.columns.find((column) =>
    column.cards.some((card) => card.id === cardId),
  )?.id;
}
