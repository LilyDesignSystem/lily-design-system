import { test, expect } from '@playwright/test';

test.describe('component page: section-heading', () => {
  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/section-heading');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the H1 with the component name', async ({ page }) => {
    await page.goto('/components/section-heading');
    await expect(
      page.getByRole('heading', { level: 1, name: new RegExp('^SectionHeading$') })
    ).toBeVisible();
  });

  test('shows the back link to /components', async ({ page }) => {
    await page.goto('/components/section-heading');
    const back = page.getByRole('link', { name: /Back to components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components');
  });
});
