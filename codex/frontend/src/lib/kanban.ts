export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  name: string;
  cards: Card[];
};

export type Board = {
  columns: Column[];
};

export const createInitialBoard = (): Board => ({
  columns: [
    {
      id: "backlog",
      name: "Backlog",
      cards: [
        {
          id: "card-market-brief",
          title: "Market brief",
          details: "Summarize customer pain points and the MVP positioning.",
        },
        {
          id: "card-copy-pass",
          title: "Copy pass",
          details: "Tighten the empty states, button labels, and column titles.",
        },
      ],
    },
    {
      id: "ready",
      name: "Ready",
      cards: [
        {
          id: "card-design-review",
          title: "Design review",
          details: "Check spacing, hierarchy, and interaction polish before build.",
        },
      ],
    },
    {
      id: "in-progress",
      name: "In Progress",
      cards: [
        {
          id: "card-board-ui",
          title: "Board UI",
          details: "Build the responsive board and card composition.",
        },
        {
          id: "card-drag-drop",
          title: "Drag and drop",
          details: "Wire card movement between all five fixed columns.",
        },
      ],
    },
    {
      id: "review",
      name: "Review",
      cards: [
        {
          id: "card-accessibility",
          title: "Accessibility pass",
          details: "Confirm labels, focus states, and keyboard-friendly controls.",
        },
      ],
    },
    {
      id: "done",
      name: "Done",
      cards: [
        {
          id: "card-project-plan",
          title: "Project plan",
          details: "Create the implementation plan and success criteria.",
        },
      ],
    },
  ],
});

export function renameColumn(board: Board, columnId: string, name: string): Board {
  return {
    columns: board.columns.map((column) =>
      column.id === columnId ? { ...column, name } : column,
    ),
  };
}

export function addCard(
  board: Board,
  columnId: string,
  card: Card,
): Board {
  return {
    columns: board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cards: [...column.cards, card] }
        : column,
    ),
  };
}

export function deleteCard(board: Board, cardId: string): Board {
  return {
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    })),
  };
}

export function moveCard(
  board: Board,
  cardId: string,
  toColumnId: string,
  targetCardId?: string,
  insertAfterTarget = false,
): Board {
  let movingCard: Card | undefined;
  let fromColumnId = "";

  for (const column of board.columns) {
    const card = column.cards.find((candidate) => candidate.id === cardId);

    if (card) {
      movingCard = card;
      fromColumnId = column.id;
      break;
    }
  }

  if (!movingCard || targetCardId === cardId) {
    return board;
  }

  return {
    columns: board.columns.map((column) => {
      if (column.id === fromColumnId) {
        const remainingCards = column.cards.filter((card) => card.id !== cardId);

        if (column.id === toColumnId) {
          const targetIndex = targetCardId
            ? remainingCards.findIndex((card) => card.id === targetCardId)
            : -1;
          const insertIndex =
            targetIndex === -1
              ? remainingCards.length
              : targetIndex + (insertAfterTarget ? 1 : 0);

          return {
            ...column,
            cards: [
              ...remainingCards.slice(0, insertIndex),
              movingCard,
              ...remainingCards.slice(insertIndex),
            ],
          };
        }

        return {
          ...column,
          cards: remainingCards,
        };
      }

      if (column.id === toColumnId) {
        const targetIndex = targetCardId
          ? column.cards.findIndex((card) => card.id === targetCardId)
          : -1;
        const insertIndex =
          targetIndex === -1
            ? column.cards.length
            : targetIndex + (insertAfterTarget ? 1 : 0);

        return {
          ...column,
          cards: [
            ...column.cards.slice(0, insertIndex),
            movingCard,
            ...column.cards.slice(insertIndex),
          ],
        };
      }

      return column;
    }),
  };
}
