import { test, expect } from '@playwright/test';

test.describe('component page: checkbox-group', () => {
  test('loads the component page with the slug query parameter', async ({ page }) => {
    const res = await page.goto('/components/component.html?slug=checkbox-group');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the component name as a heading once content is loaded', async ({ page }) => {
    await page.goto('/components/component.html?slug=checkbox-group');
    await expect(
      page.getByRole('heading', { name: new RegExp('CheckboxGroup') }).first()
    ).toBeVisible();
  });
});
