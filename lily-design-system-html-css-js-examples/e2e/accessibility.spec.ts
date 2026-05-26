import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG conformance smoke check across the HTML + CSS + JS examples app.
// Component-detail pages are served as
// /components/component.html?slug={slug}.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

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
    await page.goto('/');
    await expectNoViolations(page, 'home');
  });

  test('catalog /components/', async ({ page }) => {
    await page.goto('/components/');
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
      await page.goto(`/components/component.html?slug=${slug}`);
      await expectNoViolations(page, `/components/component.html?slug=${slug}`);
    });
  }
});

const composedPages = [
  '/contact-form/',
  '/dashboard/',
  '/dialog-flow/',
  '/file-upload-form/',
  '/navigation-and-menus/',
  '/page-layout/',
  '/rating-and-feedback/',
  '/search-and-filter/',
  '/settings-page/',
  '/tabbed-interface/',
  '/task-management/',
  '/timeline-and-cards/',
];

test.describe('accessibility: composed-page demos', () => {
  for (const route of composedPages) {
    test(route, async ({ page }) => {
      await page.goto(route);
      await expectNoViolations(page, route);
    });
  }
});
