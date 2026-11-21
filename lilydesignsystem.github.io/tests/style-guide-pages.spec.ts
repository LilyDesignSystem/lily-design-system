import { test, expect } from '@playwright/test';

// The style guide: seven English pages under /en-001/ that share one in-page navigation.
const PAGES = [
  { slug: 'styles', h1: 'Styles' },
  { slug: 'principles', h1: 'Principles' },
  { slug: 'colours', h1: 'Colours' },
  { slug: 'typographies', h1: 'Typographies' },
  { slug: 'icons', h1: 'Icons' },
  { slug: 'layouts', h1: 'Layouts' },
  { slug: 'templates', h1: 'Templates' }
];

for (const { slug, h1 } of PAGES) {
  test.describe(`style guide: /en-001/${slug}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/en-001/${slug}/`);
    });

    test('has one h1, a main landmark and a navigation that marks this page', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(new RegExp(`^${h1}`));
      await expect(page.getByRole('main')).toBeVisible();
      const nav = page.getByRole('navigation', { name: 'Style guide' });
      await expect(nav.getByRole('link')).toHaveCount(PAGES.length);
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    });

    test('has no horizontal scroll at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    });
  });
}

test('the hub links all six topic pages', async ({ page }) => {
  await page.goto('/en-001/styles/');
  for (const { slug } of PAGES.slice(1)) {
    await expect(page.locator('.card-grid').locator(`a[href="/en-001/${slug}/"]`)).toHaveCount(1);
  }
});

test('the colours page measures real contrast for the current theme', async ({ page }) => {
  await page.goto('/en-001/colours/');
  const table = page.getByRole('table', { name: 'Contrast of colour pairs in the current theme' });
  // Eight roles plus three surfaces, plus the header row.
  await expect(table.getByRole('row')).toHaveCount(1 + 11);
  await expect(table.getByText('Measuring…')).toHaveCount(0);
  const ratios = await table.locator('tbody tr td:nth-child(3)').allTextContents();
  expect(ratios.every((r) => /^\d+\.\d{2}:1$/.test(r))).toBe(true);
});

test('the typographies page marks the language of each specimen', async ({ page }) => {
  await page.goto('/en-001/typographies/');
  await expect(page.locator('.script-text[lang="ar"]')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.script-text[lang="th"]')).toBeVisible();
});

test('every bundled icon on the icons page is decorative', async ({ page }) => {
  await page.goto('/en-001/icons/');
  const gallery = page.locator('.gallery');
  await expect(gallery.locator('svg')).toHaveCount(16);
  await expect(gallery.locator('svg[aria-hidden="true"]')).toHaveCount(16);
});
