import { test, expect } from '@playwright/test';

test.describe('component page: floating-panel', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/floating-panel/');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders a visible non-empty H1', async ({ page }) => {
    await page.goto('/components/floating-panel/');
    const h1 = page.getByRole('heading', { level: 1 }).first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');
  });
});
