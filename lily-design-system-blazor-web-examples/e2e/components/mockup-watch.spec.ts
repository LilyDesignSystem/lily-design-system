import { test, expect } from '@playwright/test';

test.describe('component page: mockup-watch', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/mockup-watch');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the H1 with the component name', async ({ page }) => {
    await page.goto('/components/mockup-watch');
    await expect(
      page.getByRole('heading', { level: 1, name: new RegExp('^MockupWatch$') })
    ).toBeVisible();
  });

  test('shows the back link to /components', async ({ page }) => {
    await page.goto('/components/mockup-watch');
    const back = page.getByRole('link', { name: /Back to components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components');
  });
});
