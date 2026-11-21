import { test, expect } from '@playwright/test';

// Pages that show developers why and how to try Lily from three working traditions.
const PAGES = [
  { slug: 'agile', h1: 'Lily and agile', tables: 2 },
  { slug: 'itil5', h1: 'Lily and ITIL 5', tables: 3 },
  { slug: 'prince2', h1: 'Lily and PRINCE2', tables: 3 }
];

for (const { slug, h1, tables } of PAGES) {
  test.describe(`interest page: /en-001/${slug}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/en-001/${slug}/`);
    });

    test('has one h1, a main landmark, captioned tables and a way to try it', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
      await expect(page.getByRole('main')).toBeVisible();
      const all = page.getByRole('table');
      expect(await all.count()).toBeGreaterThanOrEqual(tables);
      for (const t of await all.all()) await expect(t.locator('caption')).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 2, name: /Try it|stage plan/i }).first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: /Where it does not help/i })).toBeVisible();
    });

    test('has no horizontal scroll at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    });

    test('every table region is a labelled, focusable scroll area', async ({ page }) => {
      const regions = page.locator('.scroll[role="region"]');
      expect(await regions.count()).toBeGreaterThan(0);
      for (const r of await regions.all()) {
        await expect(r).toHaveAttribute('aria-label', /.+/);
        await expect(r).toHaveAttribute('tabindex', '0');
      }
    });
  });
}

test('the framework pages credit the publisher and disclaim affiliation', async ({ page }) => {
  for (const slug of ['itil5', 'prince2']) {
    await page.goto(`/en-001/${slug}/`);
    await expect(page.getByText(/registered trademark of its owner/)).toBeVisible();
    await expect(page.getByText(/not endorsed by, or affiliated with, the publisher/)).toBeVisible();
    await expect(page.locator('a[href*="peoplecert.org"]').first()).toBeVisible();
  }
});

test('the agile page names all four values and twelve principles', async ({ page }) => {
  await page.goto('/en-001/agile/');
  const values = page.getByRole('table', { name: /four values/ });
  await expect(values.locator('tbody tr')).toHaveCount(4);
  const principles = page.getByRole('table', { name: /twelve principles/ });
  await expect(principles.locator('tbody tr')).toHaveCount(12);
});
