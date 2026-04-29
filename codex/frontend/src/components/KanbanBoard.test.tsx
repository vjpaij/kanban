import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { KanbanBoard } from "./KanbanBoard";

describe("KanbanBoard", () => {
  it("renders the single board with five populated columns", () => {
    render(<KanbanBoard />);

    expect(screen.getByRole("heading", { name: "Kanban Board" })).toBeInTheDocument();
    expect(screen.getAllByTestId(/^column-/)).toHaveLength(5);
    expect(screen.getByDisplayValue("Backlog")).toBeInTheDocument();
    expect(screen.getByText("Market brief")).toBeInTheDocument();
  });

  it("renames a column", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const backlogName = screen.getByLabelText("Rename Backlog column");
    await user.clear(backlogName);
    await user.type(backlogName, "Ideas");

    expect(screen.getByDisplayValue("Ideas")).toBeInTheDocument();
  });

  it("adds and deletes a card", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const doneColumn = screen.getByTestId("column-done");
    await user.type(within(doneColumn).getByLabelText("Card title for Done"), "Release note");
    await user.type(
      within(doneColumn).getByLabelText("Card details for Done"),
      "Share the MVP with stakeholders.",
    );
    await user.click(within(doneColumn).getByRole("button", { name: "Add" }));

    expect(screen.getByText("Release note")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Release note" }));

    expect(screen.queryByText("Release note")).not.toBeInTheDocument();
  });
});
