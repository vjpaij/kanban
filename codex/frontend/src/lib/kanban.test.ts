import { describe, expect, it } from "vitest";
import {
  addCard,
  createInitialBoard,
  deleteCard,
  moveCard,
  renameColumn,
} from "./kanban";

describe("kanban state helpers", () => {
  it("creates exactly five populated columns", () => {
    const board = createInitialBoard();

    expect(board.columns).toHaveLength(5);
    expect(board.columns.every((column) => column.cards.length > 0)).toBe(true);
  });

  it("renames a column", () => {
    const board = createInitialBoard();
    const updated = renameColumn(board, "backlog", "Ideas");

    expect(updated.columns[0].name).toBe("Ideas");
  });

  it("adds a card to a column", () => {
    const board = createInitialBoard();
    const updated = addCard(board, "done", {
      id: "card-new",
      title: "Ship notes",
      details: "Write final review notes.",
    });

    expect(updated.columns[4].cards).toContainEqual({
      id: "card-new",
      title: "Ship notes",
      details: "Write final review notes.",
    });
  });

  it("deletes a card", () => {
    const board = createInitialBoard();
    const updated = deleteCard(board, "card-project-plan");

    expect(updated.columns.flatMap((column) => column.cards)).not.toContainEqual(
      expect.objectContaining({ id: "card-project-plan" }),
    );
  });

  it("moves a card between columns", () => {
    const board = createInitialBoard();
    const updated = moveCard(board, "card-market-brief", "review");

    expect(updated.columns[0].cards).not.toContainEqual(
      expect.objectContaining({ id: "card-market-brief" }),
    );
    expect(updated.columns[3].cards).toContainEqual(
      expect.objectContaining({ id: "card-market-brief" }),
    );
  });

  it("reorders a card in the same column", () => {
    const board = createInitialBoard();
    const updated = moveCard(
      board,
      "card-market-brief",
      "backlog",
      "card-copy-pass",
      true,
    );

    expect(updated.columns[0].cards.map((card) => card.id)).toEqual([
      "card-copy-pass",
      "card-market-brief",
    ]);
  });
});
