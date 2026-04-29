import { expect, test } from "@playwright/test";

test("loads the populated five-column board", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Kanban Board" })).toBeVisible();
  await expect(page.getByLabel("Kanban board").locator("article").filter({ has: page.locator("input") })).toHaveCount(5);
  await expect(page.getByText("Market brief")).toBeVisible();
  await expect(page.getByText("Project plan")).toBeVisible();
});

test("renames a column and adds then deletes a card", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Rename Backlog column").fill("Ideas");
  await expect(page.getByLabel("Rename Ideas column")).toHaveValue("Ideas");

  const doneColumn = page.getByTestId("column-done");
  await doneColumn.getByLabel("Card title for Done").fill("Release note");
  await doneColumn.getByLabel("Card details for Done").fill("Share the MVP.");
  await doneColumn.getByRole("button", { name: "Add" }).click();

  await expect(page.getByText("Release note")).toBeVisible();
  await page
    .getByTestId(/^card-card-/)
    .filter({ hasText: "Release note" })
    .getByRole("button", { name: "Delete Release note" })
    .click();
  await expect(page.getByText("Release note")).toBeHidden();
});

test("moves a card with drag and drop", async ({ page }) => {
  await page.goto("/");

  const card = page.getByTestId("card-card-market-brief");
  const reviewColumn = page.getByTestId("column-review");

  const cardBox = await card.boundingBox();
  const reviewBox = await reviewColumn.boundingBox();

  expect(cardBox).not.toBeNull();
  expect(reviewBox).not.toBeNull();

  await page.mouse.move(cardBox!.x + cardBox!.width / 2, cardBox!.y + cardBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(reviewBox!.x + reviewBox!.width / 2, reviewBox!.y + 80, {
    steps: 12,
  });
  await page.mouse.up();

  await expect(reviewColumn.getByText("Market brief")).toBeVisible();
});

test("reorders cards in the same column", async ({ page }) => {
  await page.goto("/");

  const backlogColumn = page.getByTestId("column-backlog");
  const marketBrief = page.getByTestId("card-card-market-brief");
  const copyPass = page.getByTestId("card-card-copy-pass");

  const marketBox = await marketBrief.boundingBox();
  const copyBox = await copyPass.boundingBox();

  expect(marketBox).not.toBeNull();
  expect(copyBox).not.toBeNull();

  await page.mouse.move(
    marketBox!.x + marketBox!.width / 2,
    marketBox!.y + marketBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(copyBox!.x + copyBox!.width / 2, copyBox!.y + copyBox!.height - 8, {
    steps: 12,
  });
  await page.mouse.up();

  await expect
    .poll(async () =>
      backlogColumn.getByTestId(/^card-/).evaluateAll((cards) =>
        cards.map((card) => card.textContent ?? ""),
      ),
    )
    .toEqual([
      expect.stringContaining("Copy pass"),
      expect.stringContaining("Market brief"),
    ]);
});
