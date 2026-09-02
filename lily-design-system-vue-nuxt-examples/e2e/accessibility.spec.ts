import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG conformance smoke check across the Nuxt examples app.
// See the SvelteKit examples app's accessibility.spec.ts for the rationale
// — this file mirrors that pattern for the Nuxt route shape.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// The theme-picker's <link rel="stylesheet"> is appended after first
// paint, so a scan that lands before it parses (or before its transition
// settles) can sample a part-way/unstyled colour and trip axe's
// color-contrast rule — the same dynamically-appended-stylesheet race
// already root-caused and fixed for Blazor's /components/dialog (P7-T17)
// and the html-css-js-examples app (2026-08-30). Confirmed here
// 2026-09-02: repeat-each runs showed a different composed page failing
// color-contrast each time, never the same one twice, and each one
// passed clean on isolated retry — the signature of this exact race, not
// a real defect. Wait for the theme stylesheet to actually parse, and
// let the transition settle, before scanning.
async function gotoAndWaitForTheme(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => {
    const link = document.querySelector('link[data-lily-theme-picker]') as HTMLLinkElement | null;
    return link !== null && link.sheet !== null;
  });
  await page.waitForTimeout(300);
}

async function expectNoViolations(page: import('@playwright/test').Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  if (results.violations.length > 0) {
    const summary = results.violations
      .map(v => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
      .join('\n');
    throw new Error(`axe found ${results.violations.length} WCAG violations on ${label}:\n${summary}`);
  }
}

test.describe('accessibility: top-level routes', () => {
  test('home /', async ({ page }) => {
    await gotoAndWaitForTheme(page, '/');
    await expectNoViolations(page, 'home');
  });

  test('catalog /components', async ({ page }) => {
    await gotoAndWaitForTheme(page, '/components');
    await expectNoViolations(page, '/components');
  });
});

const componentSamples = [
  'button',
  'text-input',
  'data-table',
  'dialog',
  'badge',
  'breadcrumb-nav',
  'check-list',
  'header',
  'footer',
  'grail-layout',
  'select',
  'fieldset',
  'figure',
  'progress',
  'meter',
];

test.describe('accessibility: component-detail samples', () => {
  for (const slug of componentSamples) {
    test(`/components/${slug}`, async ({ page }) => {
      await gotoAndWaitForTheme(page, `/components/${slug}`);
      await expectNoViolations(page, `/components/${slug}`);
    });
  }
});

const composedPages = [
  '/book-an-appointment',
  '/contact-form',
  '/dashboard',
  '/dialog-flow',
  '/file-upload-form',
  '/navigation-and-menus',
  '/page-layout',
  '/rating-and-feedback',
  '/rtl-demo',
  '/search-and-filter',
  '/settings-page',
  '/tabbed-interface',
  '/task-management',
  '/timeline-and-cards',
];

test.describe('accessibility: composed-page demos', () => {
  for (const route of composedPages) {
    test(route, async ({ page }) => {
      await gotoAndWaitForTheme(page, route);
      await expectNoViolations(page, route);
    });
  }
});
