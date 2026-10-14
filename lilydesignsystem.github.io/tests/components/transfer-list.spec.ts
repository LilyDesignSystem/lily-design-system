import { test, expect } from '@playwright/test';

const slug = 'transfer-list';
const title = 'Transfer List';

test.describe('component page: ' + slug, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/' + slug + '/');
  });

  test('responds with a non-error status', async ({ page }) => {
    const res = await page.goto('/components/' + slug + '/');
    expect(res, 'navigation response').not.toBeNull();
    expect(res!.status(), 'http status').toBeLessThan(400);
  });

  test('document title contains the component name', async ({ page }) => {
    await expect(page).toHaveTitle(/Transfer List\s+\u2014\s+Lily Design System/);
  });

  test('renders the H1 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  });

  test('renders the documentation article', async ({ page }) => {
    await expect(page.locator('article.component-page').first()).toBeVisible();
  });
});
