import { test, expect } from '@playwright/test';

test.describe('component page: text-area-with-character-counter', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/text-area-with-character-counter/');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders a visible non-empty H1', async ({ page }) => {
    await page.goto('/components/text-area-with-character-counter/');
    const h1 = page.getByRole('heading', { level: 1 }).first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');
  });
});
