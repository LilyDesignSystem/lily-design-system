import { test, expect } from '@playwright/test';

test.describe('component page: error-message', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/error-message');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the H1 with the component name', async ({ page }) => {
    await page.goto('/components/error-message');
    await expect(
      page.getByRole('heading', { level: 1, name: new RegExp('^ErrorMessage$') })
    ).toBeVisible();
  });

  test('shows the back link to /components', async ({ page }) => {
    await page.goto('/components/error-message');
    const back = page.getByRole('link', { name: /Back to components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components');
  });
});
