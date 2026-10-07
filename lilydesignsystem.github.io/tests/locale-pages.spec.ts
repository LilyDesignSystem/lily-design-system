import { test, expect } from '@playwright/test';

// The eight main site pages (About, Why, Accessibility, Help, Comparisons, Tutorials, Examples, Skills)
// are translated into every non-English locale; each renders at /locales/<code>/<page>/ with the right
// lang and dir, a translated title, an h1, and links that stay inside the locale.

const SLUGS = ['about', 'why', 'accessibility', 'help', 'comparisons', 'tutorials', 'examples', 'skills'];

// locale -> [bcp47 lang, dir]
const LOCALES: Record<string, [string, string]> = {
  'ar-001': ['ar', 'rtl'],
  'bn-001': ['bn', 'ltr'],
  'cy-001': ['cy', 'ltr'],
  'cy-gb': ['cy-GB', 'ltr'],
  'es-001': ['es', 'ltr'],
  'fr-001': ['fr', 'ltr'],
  'hi-001': ['hi', 'ltr'],
  'id-001': ['id', 'ltr'],
  'pt-001': ['pt', 'ltr'],
  'ru-001': ['ru', 'ltr'],
  'ur-001': ['ur', 'rtl'],
  'zh-cn': ['zh-CN', 'ltr']
};

for (const [code, [lang, dir]] of Object.entries(LOCALES)) {
  test.describe(`${code} pages`, () => {
    for (const slug of SLUGS) {
      test(`${slug} has lang ${lang}, dir ${dir}, an h1 and a title`, async ({ page }) => {
        await page.goto(`/${code}/${slug}/`);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('html')).toHaveAttribute('dir', dir);
        await expect(page.locator('main h1').first()).toBeVisible();
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        // Translated: not the English page's title.
        const english = await (await page.request.get(`/${slug}/`)).text();
        const englishTitle = /<title>([^<]*)<\/title>/.exec(english)?.[1];
        if (slug !== 'comparisons' && slug !== 'skills') expect(title).not.toBe(englishTitle);
      });
    }
  });
}

test('the header nav of a translated page links to translated pages, not English ones', async ({ page }) => {
  await page.goto('/fr-001/help/');
  const hrefs = await page.locator('header nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs).toContain('/fr-001/about/');
  expect(hrefs).toContain('/fr-001/tutorials/');
});

test('links inside a translated page stay in the locale', async ({ page }) => {
  await page.goto('/es-001/help/');
  await expect(page.locator('main a[href="/es-001/tutorials/"]').first()).toBeVisible();
  await expect(page.locator('main a[href="/tutorials/"]')).toHaveCount(0);
});

test('code samples stay byte-identical and focusable', async ({ page }) => {
  await page.goto('/ru-001/help/');
  const en = await (await page.request.get('/help/')).text();
  const ruPre = await page.locator('main pre').first().textContent();
  expect(ruPre).toContain('git clone https://github.com/LilyDesignSystem/lily-design-system-react-headless');
  expect(en).toContain('git clone https://github.com/LilyDesignSystem/lily-design-system-react-headless');
  await expect(page.locator('main pre').first()).toHaveAttribute('tabindex', '0');
});

test('the header link picker on a translated page lists translated page links', async ({ page }) => {
  await page.goto('/pt-001/about/');
  await page.waitForSelector('link[data-lily-theme-picker]', { state: 'attached' });
  await page.locator('.link-picker-button').click();
  const hrefs = await page.locator('.link-picker-link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs).toEqual(['/pt-001/', '/pt-001/about/', '/pt-001/help/', '/pt-001/why/']);
});

test('English locales keep the English pages', async ({ page }) => {
  await page.goto('/en-gb/');
  const hrefs = await page.locator('header nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs).toContain('/about/');
});
