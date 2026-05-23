import { test, expect } from '@playwright/test';

test.describe('component page: time-picker-input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/time-picker-input');
  });

  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/time-picker-input');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the H1 with the component name', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: new RegExp('^TimePickerInput$') })
    ).toBeVisible();
  });

  test('shows the back link to /components', async ({ page }) => {
    const back = page.getByRole('link', { name: /Back to components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components');
  });
});
