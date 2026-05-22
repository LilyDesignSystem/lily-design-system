import { test, expect } from '@playwright/test';

test.describe('component page: tree-nav', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/tree-nav/');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders a visible non-empty H1', async ({ page }) => {
    await page.goto('/components/tree-nav/');
    const h1 = page.getByRole('heading', { level: 1 }).first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');
  });
});
