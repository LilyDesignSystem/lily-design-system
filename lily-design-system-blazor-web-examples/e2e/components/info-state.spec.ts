import { test, expect } from '@playwright/test';

test.describe('component page: info-state', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/info-state');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the H1 with the component name', async ({ page }) => {
    await page.goto('/components/info-state');
    await expect(
      page.getByRole('heading', { level: 1, name: new RegExp('^InfoState$') })
    ).toBeVisible();
  });

  test('shows the back link to /components', async ({ page }) => {
    await page.goto('/components/info-state');
    const back = page.getByRole('link', { name: /Back to components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components');
  });
});
