import { test, expect } from '@playwright/test';

test.describe('component page: step-list-item', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/step-list-item');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the H1 with the component name', async ({ page }) => {
    await page.goto('/components/step-list-item');
    await expect(
      page.getByRole('heading', { level: 1, name: new RegExp('^StepListItem$') })
    ).toBeVisible();
  });

  test('shows the back link to /components', async ({ page }) => {
    await page.goto('/components/step-list-item');
    const back = page.getByRole('link', { name: /Back to components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components');
  });
});
