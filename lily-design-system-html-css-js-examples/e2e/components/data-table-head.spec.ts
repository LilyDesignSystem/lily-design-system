import { test, expect } from '@playwright/test';

test.describe('component page: data-table-head', () => {
  test('loads the component page with the slug query parameter', async ({ page }) => {
    const res = await page.goto('/components/component.html?slug=data-table-head');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the component name as a heading once content is loaded', async ({ page }) => {
    await page.goto('/components/component.html?slug=data-table-head');
    await expect(
      page.getByRole('heading', { name: new RegExp('DataTableHead') }).first()
    ).toBeVisible();
  });
});
