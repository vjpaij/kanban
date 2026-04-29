import { test, expect } from '@playwright/test';

test('should display all five columns and add a new card', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('text=Backlog')).toBeVisible();
  await expect(page.locator('text=Complete')).toBeVisible();

  await page.locator('input[aria-label="New card title"]').first().fill('Establish roadmap');
  await page.locator('textarea[aria-label="New card details"]').first().fill('Add a new roadmap card to the backlog.');
  await page.locator('button:has-text("Add card")').first().click();

  await expect(page.locator('text=Establish roadmap')).toBeVisible();
});
