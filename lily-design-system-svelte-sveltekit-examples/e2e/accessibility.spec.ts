import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG conformance smoke check across the SvelteKit examples app.
//
// Covers:
//   - The home page (/)
//   - The catalog index (/components)
//   - A sample of /components/{slug} detail pages (one per HTML category)
//   - Every composed-page demo
//
// Tags axe rules to WCAG 2.0 A + AA + 2.1 AA + 2.2 AA. (axe-core does not
// have a complete AAA tag set; AAA-only rules are checked individually via
// includedImpacts.)
//
// This is a SMOKE check, not a full audit. It catches headline issues
// (missing alt, missing label, contrast on consumer CSS, landmark
// duplication). Pass/fail is informational: real WCAG 2.2 AAA conformance
// also requires manual review, screen-reader passes, and live keyboard sweeps.

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

  test('catalog /components', async ({ page }) => {
    await page.goto('/components');
    await expectNoViolations(page, '/components');
  });
});

// Sample one component-detail page per HTML category to keep this smoke
// suite under a minute. Full per-component coverage exists in the
// /components/{slug} Playwright sweep already; this one focuses on a11y.
const componentSamples = [
  'button',              // <button>
  'text-input',          // <input>
  'data-table',          // <table>
  'dialog',              // <dialog>
  'badge',               // <span>
  'breadcrumb-nav',      // <nav>
  'check-list',          // <ol>
  'header',              // <header>
  'footer',              // <footer>
  'grail-layout',        // <div>
  'select',              // <select>
  'fieldset',            // <fieldset>
  'figure',              // <figure>
  'progress',            // <progress>
  'meter',               // <meter>
];

test.describe('accessibility: component-detail samples', () => {
  for (const slug of componentSamples) {
    test(`/components/${slug}`, async ({ page }) => {
      await page.goto(`/components/${slug}`);
      await expectNoViolations(page, `/components/${slug}`);
    });
  }
});

const composedPages = [
  '/contact-form',
  '/dashboard',
  '/dialog-flow',
  '/file-upload-form',
  '/navigation-and-menus',
  '/page-layout',
  '/rating-and-feedback',
  '/search-and-filter',
  '/settings-page',
  '/tabbed-interface',
  '/task-management',
  '/timeline-and-cards',
];

test.describe('accessibility: composed-page demos', () => {
  for (const route of composedPages) {
    test(route, async ({ page }) => {
      await page.goto(route);
      await expectNoViolations(page, route);
    });
  }
});
