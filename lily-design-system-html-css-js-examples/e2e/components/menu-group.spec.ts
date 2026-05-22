import { test, expect } from '@playwright/test';

test.describe('component page: menu-group', () => {
  test('loads the component page with the slug query parameter', async ({ page }) => {
    const res = await page.goto('/components/component.html?slug=menu-group');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the component name as a heading once content is loaded', async ({ page }) => {
    await page.goto('/components/component.html?slug=menu-group');
    await expect(
      page.getByRole('heading', { name: new RegExp('MenuGroup') }).first()
    ).toBeVisible();
  });
});
