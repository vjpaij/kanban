import { test, expect } from '@playwright/test';

test.describe('Kanban Board MVP', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial columns and dummy data', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1')).toContainText('Kanban MVP');
    
    // Check initial 5 columns are present
    const columns = page.locator('.column-title');
    await expect(columns).toHaveCount(5);
    await expect(columns.nth(0)).toHaveText('To Do');
    await expect(columns.nth(4)).toHaveText('Done');
    
    // Check dummy cards are present
    const cards = page.locator('.card-container');
    await expect(cards).toHaveCount(4);
  });

  test('should be able to add a new card', async ({ page }) => {
    // Click "Add Card" on the first column
    const firstCol = page.locator('.column-container').nth(0);
    await firstCol.locator('.add-card-btn').click();
    
    // Fill out the form
    await firstCol.locator('.add-card-input.title').fill('New E2E Task');
    await firstCol.locator('.add-card-input.details').fill('This is a test task');
    
    // Submit
    await firstCol.locator('.btn-primary').click();
    
    // Verify card is added
    const newCard = firstCol.locator('.card-title', { hasText: 'New E2E Task' });
    await expect(newCard).toBeVisible();
    
    // Verify total cards increased
    const cards = page.locator('.card-container');
    await expect(cards).toHaveCount(5);
  });

  test('should be able to delete a card', async ({ page }) => {
    const cards = page.locator('.card-container');
    await expect(cards).toHaveCount(4);
    
    // Click delete on the first card
    const firstCard = cards.nth(0);
    await firstCard.locator('.card-delete-btn').click();
    
    // Verify total cards decreased
    await expect(cards).toHaveCount(3);
  });

  test('should be able to rename a column', async ({ page }) => {
    const firstColTitle = page.locator('.column-title').nth(0);
    await expect(firstColTitle).toHaveText('To Do');
    
    // Click title to edit
    await firstColTitle.click();
    
    // The input should appear
    const input = page.locator('.column-rename-input');
    await expect(input).toBeVisible();
    
    // Change value and submit
    await input.fill('Backlog');
    await input.press('Enter');
    
    // Verify new title
    await expect(page.locator('.column-title').nth(0)).toHaveText('Backlog');
  });

});
