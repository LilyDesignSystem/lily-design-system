import { test, expect } from '@playwright/test';

test.describe('component page: net-promoter-score-view', () => {
  test('loads the component page with the slug query parameter', async ({ page }) => {
    const res = await page.goto('/components/component.html?slug=net-promoter-score-view');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('renders the component name as a heading once content is loaded', async ({ page }) => {
    await page.goto('/components/component.html?slug=net-promoter-score-view');
    await expect(
      page.getByRole('heading', { name: new RegExp('NetPromoterScoreView') }).first()
    ).toBeVisible();
  });
});
