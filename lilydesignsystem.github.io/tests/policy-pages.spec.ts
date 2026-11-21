import { test, expect } from '@playwright/test';

// The five policy and navigation pages linked from every page's footer.
const PAGES = [
  { slug: 'accessibility-statement', h1: 'Accessibility statement' },
  { slug: 'cookie-policy', h1: 'Cookie policy' },
  { slug: 'privacy-policy', h1: 'Privacy policy' },
  { slug: 'terms-of-use', h1: 'Terms of use' },
  { slug: 'site-map', h1: 'Site map' }
];

for (const { slug, h1 } of PAGES) {
  test.describe(`policy page: /en-001/${slug}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/en-001/${slug}/`);
    });

    test('has one h1, a main landmark and the footer policy links', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
      await expect(page.getByRole('main')).toBeVisible();
      const footer = page.getByRole('navigation', { name: 'Policies' });
      await expect(footer.getByRole('link')).toHaveCount(5);
    });

    test('has no horizontal scroll at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    });
  });
}

test('the footer policy links appear on an ordinary page and are marked as English', async ({ page }) => {
  await page.goto('/getting-started/');
  const footer = page.getByRole('navigation', { name: 'Policies' });
  await expect(footer.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/en-001/privacy-policy/');
  await expect(footer.locator('a[lang="en"]')).toHaveCount(5);
});

// The policies say the site sets no cookies and lists the browser storage it uses. These tests keep that true.
test('the site sets no cookies, even after the preferences are used', async ({ page, context }) => {
  await page.goto('/getting-started/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('button', { name: /text size/i }).click();
  await page.getByRole('option').nth(1).click();
  expect(await context.cookies()).toEqual([]);
});

test('every browser-storage key the site writes is listed on the cookie policy', async ({ page }) => {
  await page.goto('/getting-started/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('button', { name: /text size/i }).click();
  await page.getByRole('option').nth(1).click();
  const keys = await page.evaluate(() => [...Object.keys(localStorage), ...Object.keys(sessionStorage)].filter((k) => k.startsWith('lily-')));
  expect(keys.length).toBeGreaterThan(0);
  await page.goto('/en-001/cookie-policy/');
  const text = await page.getByRole('table', { name: 'Browser storage used by this site' }).innerText();
  for (const k of keys) expect(text, `key ${k}`).toContain(k);
});

test('every link on the site map resolves', async ({ page, request }) => {
  await page.goto('/en-001/site-map/');
  const hrefs = await page.locator('main a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))]);
  expect(hrefs.length).toBeGreaterThan(40);
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});
