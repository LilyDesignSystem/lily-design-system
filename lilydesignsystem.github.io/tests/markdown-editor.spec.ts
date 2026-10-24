import { test, expect } from '@playwright/test';

test.describe('markdown editor page', () => {
  test('renders, names all nine frameworks, and says it is not published', async ({ page }) => {
    const res = await page.goto('/markdown-editor/');
    expect(res!.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Markdown editor');
    await expect(page).toHaveTitle(/Markdown editor — Lily Design System/);
    for (const fw of ['Svelte', 'React', 'Vue', 'Angular', 'HTML', 'Web Components', 'Alpine.js', 'Nunjucks', 'Blazor']) {
      await expect(page.getByRole('rowheader', { name: fw, exact: true })).toBeVisible();
    }
    await expect(page.getByText('Not published yet.')).toBeVisible();
  });
});
