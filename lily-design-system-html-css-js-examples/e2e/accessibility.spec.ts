import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG conformance smoke check across the HTML + CSS + JS examples app.
// Component-detail pages are served as
// /components/component.html?slug={slug}.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Every page's <head> runs assets/js/theme-boot.js: a parser-blocking
// classic script, but the <link rel="stylesheet"> it appendChild()s is
// not — a dynamically-appended stylesheet doesn't make the browser block
// first paint on it the way a static <link> in the source HTML does. The
// button CSS also transitions background-color/color over 120ms, so a
// scan that lands in that window can sample a part-way blended colour
// instead of the settled theme colour.
//
// This intermittently failed axe's color-contrast rule on
// /navigation-and-menus.html's mobile-menu button: repeated
// getComputedStyle + pixel sampling always settled on white-on-blue at a
// contrast well over 7:1, while the flaky axe report showed a
// grey-on-mid-blue reading that changed between runs — the same
// dynamically-appended-stylesheet race already root-caused and fixed for
// the Blazor examples app's /components/dialog (P7-T17). Wait for the
// theme stylesheet to actually parse, and let the transition settle,
// before scanning here too.
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

  test('catalog /components/', async ({ page }) => {
    await gotoAndWaitForTheme(page, '/components/');
    await expectNoViolations(page, '/components/');
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
    test(`component.html?slug=${slug}`, async ({ page }) => {
      await gotoAndWaitForTheme(page, `/components/component.html?slug=${slug}`);
      await expectNoViolations(page, `/components/component.html?slug=${slug}`);
    });
  }
});

// Static-file paths in this app are flat `.html` files (not directory
// index files), so the URL has the `.html` extension. Trailing-slash
// directory URLs would 404 to an empty document.
const composedPages = [
  '/contact-form.html',
  '/dashboard.html',
  '/dialog-flow.html',
  '/file-upload-form.html',
  '/navigation-and-menus.html',
  '/page-layout.html',
  '/rating-and-feedback.html',
  '/search-and-filter.html',
  '/settings-page.html',
  '/tabbed-interface.html',
  '/task-management.html',
  '/timeline-and-cards.html',
];

test.describe('accessibility: composed-page demos', () => {
  for (const route of composedPages) {
    test(route, async ({ page }) => {
      await gotoAndWaitForTheme(page, route);
      await expectNoViolations(page, route);
    });
  }
});
