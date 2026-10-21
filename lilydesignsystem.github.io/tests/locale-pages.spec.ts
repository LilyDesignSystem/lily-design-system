import { test, expect } from '@playwright/test';

// The eight main site pages (About, Why, Accessibility, Help, Comparisons, Tutorials, Examples, Skills)
// are translated into every non-English locale; each renders at /locales/<code>/<page>/ with the right
// lang and dir, a translated title, an h1, and links that stay inside the locale.

const SLUGS = ['about', 'why', 'accessibility', 'help', 'comparisons', 'tutorials', 'examples', 'skills'];

// locale -> [bcp47 lang, dir]
const LOCALES: Record<string, [string, string]> = {
  'ar-001': ['ar', 'rtl'],
  'bg-001': ['bg', 'ltr'],
  'bg-bg': ['bg-BG', 'ltr'],
  'bh-001': ['bh', 'ltr'],
  'bn-001': ['bn', 'ltr'],
  'cs-001': ['cs', 'ltr'],
  'cs-cz': ['cs-CZ', 'ltr'],
  'cy-001': ['cy', 'ltr'],
  'cy-gb': ['cy-GB', 'ltr'],
  'da-001': ['da', 'ltr'],
  'da-dk': ['da-DK', 'ltr'],
  'de-001': ['de', 'ltr'],
  'de-at': ['de-AT', 'ltr'],
  'de-de': ['de-DE', 'ltr'],
  'el-001': ['el', 'ltr'],
  'el-cy': ['el-CY', 'ltr'],
  'el-gr': ['el-GR', 'ltr'],
  'es-001': ['es', 'ltr'],
  'es-es': ['es-ES', 'ltr'],
  'et-001': ['et', 'ltr'],
  'et-ee': ['et-EE', 'ltr'],
  'eu-001': ['eu', 'ltr'],
  'eu-es': ['eu-ES', 'ltr'],
  'fa-001': ['fa', 'rtl'],
  'fi-001': ['fi', 'ltr'],
  'fi-fi': ['fi-FI', 'ltr'],
  'fr-001': ['fr', 'ltr'],
  'fr-be': ['fr-BE', 'ltr'],
  'fr-fr': ['fr-FR', 'ltr'],
  'ga-001': ['ga', 'ltr'],
  'ga-ie': ['ga-IE', 'ltr'],
  'gd-001': ['gd', 'ltr'],
  'gd-gb': ['gd-GB', 'ltr'],
  'gu-001': ['gu', 'ltr'],
  'ha-001': ['ha', 'ltr'],
  'he-001': ['he', 'rtl'],
  'hi-001': ['hi', 'ltr'],
  'hi-in': ['hi-IN', 'ltr'],
  'hr-001': ['hr', 'ltr'],
  'hr-hr': ['hr-HR', 'ltr'],
  'hu-001': ['hu', 'ltr'],
  'hu-hu': ['hu-HU', 'ltr'],
  'id-001': ['id', 'ltr'],
  'id-id': ['id-ID', 'ltr'],
  'is-001': ['is', 'ltr'],
  'is-is': ['is-IS', 'ltr'],
  'it-001': ['it', 'ltr'],
  'it-it': ['it-IT', 'ltr'],
  'ja-001': ['ja', 'ltr'],
  'ja-jp': ['ja-JP', 'ltr'],
  'jv-001': ['jv', 'ltr'],
  'km-001': ['km', 'ltr'],
  'km-kh': ['km-KH', 'ltr'],
  'kn-001': ['kn', 'ltr'],
  'ko-001': ['ko', 'ltr'],
  'ko-kr': ['ko-KR', 'ltr'],
  'kw-001': ['kw', 'ltr'],
  'kw-gb': ['kw-GB', 'ltr'],
  'lb-001': ['lb', 'ltr'],
  'lb-lu': ['lb-LU', 'ltr'],
  'lo-001': ['lo', 'ltr'],
  'lo-la': ['lo-LA', 'ltr'],
  'lt-001': ['lt', 'ltr'],
  'lt-lt': ['lt-LT', 'ltr'],
  'lv-001': ['lv', 'ltr'],
  'lv-lv': ['lv-LV', 'ltr'],
  'mr-001': ['mr', 'ltr'],
  'ms-001': ['ms', 'ltr'],
  'mt-001': ['mt', 'ltr'],
  'mt-mt': ['mt-MT', 'ltr'],
  'nb-001': ['nb', 'ltr'],
  'nb-no': ['nb-NO', 'ltr'],
  'nl-001': ['nl', 'ltr'],
  'nl-nl': ['nl-NL', 'ltr'],
  'pa-001': ['pa', 'ltr'],
  'pcm-001': ['pcm', 'ltr'],
  'pl-001': ['pl', 'ltr'],
  'pl-pl': ['pl-PL', 'ltr'],
  'pt-001': ['pt', 'ltr'],
  'pt-pt': ['pt-PT', 'ltr'],
  'ro-001': ['ro', 'ltr'],
  'ro-ro': ['ro-RO', 'ltr'],
  'ru-001': ['ru', 'ltr'],
  'sco-gb': ['sco-GB', 'ltr'],
  'sk-001': ['sk', 'ltr'],
  'sk-sk': ['sk-SK', 'ltr'],
  'sl-001': ['sl', 'ltr'],
  'sl-si': ['sl-SI', 'ltr'],
  'sv-001': ['sv', 'ltr'],
  'sv-se': ['sv-SE', 'ltr'],
  'sw-001': ['sw', 'ltr'],
  'sw-tz': ['sw-TZ', 'ltr'],
  'ta-001': ['ta', 'ltr'],
  'te-001': ['te', 'ltr'],
  'th-001': ['th', 'ltr'],
  'th-th': ['th-TH', 'ltr'],
  'tl-001': ['tl', 'ltr'],
  'tr-001': ['tr', 'ltr'],
  'tr-tr': ['tr-TR', 'ltr'],
  'uk-001': ['uk', 'ltr'],
  'ur-001': ['ur', 'rtl'],
  'vi-001': ['vi', 'ltr'],
  'vi-vn': ['vi-VN', 'ltr'],
  'wuu-001': ['wuu', 'ltr'],
  'yue-001': ['yue', 'ltr'],
  'zh-001': ['zh', 'ltr'],
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
        // Dutch "Help" is the same word as English; comparisons and skills carry mostly proper nouns.
        const sameWord = slug === 'help' && code.startsWith('nl-');
        if (slug !== 'comparisons' && slug !== 'skills' && !sameWord) expect(title).not.toBe(englishTitle);
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
  expect(ruPre).toContain('git clone https://github.com/LilyDesignSystem/lily-design-system\ncd lily-design-system/lily-design-system-react-headless');
  expect(en).toContain('git clone https://github.com/LilyDesignSystem/lily-design-system\ncd lily-design-system/lily-design-system-react-headless');
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

test('every locale home page shows the framework icon row', async ({ page }) => {
  for (const code of ['en-gb', 'en-us', 'en-001', 'fr-001', 'ar-001', 'zh-cn']) {
    await page.goto(`/${code}/`);
    await expect(page.locator('.framework-icon-row .framework-icon-link')).toHaveCount(9);
    await expect(page.locator('.framework-icon-row img').first()).toBeVisible();
    expect(await page.locator('.framework-icon-row img').first().evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  }
});
