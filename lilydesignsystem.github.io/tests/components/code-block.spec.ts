import { test, expect } from '@playwright/test';

const slug = 'code-block';
const title = 'CodeBlock';

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
    await expect(page).toHaveTitle(/CodeBlock\s+\u2014\s+Lily Design System/);
  });

  test('renders the H1 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  });

  test('shows the breadcrumb back-link to /components/', async ({ page }) => {
    const back = page.getByRole('link', { name: /All components/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/components/');
  });

  test('renders the documentation article', async ({ page }) => {
    await expect(page.locator('article.component-page')).toBeVisible();
  });
});
