import { test, expect } from '@playwright/test';

test.describe('component page: qr-code-image', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/qr-code-image');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the H1 with the component name', async ({ page }) => {
    await page.goto('/components/qr-code-image');
    await expect(
      page.getByRole('heading', { level: 1, name: new RegExp('^QrCodeImage$') })
    ).toBeVisible();
  });

  test('shows the back link to /components', async ({ page }) => {
    await page.goto('/components/qr-code-image');
    const back = page.getByRole('link', { name: /Back to components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components');
  });
});
