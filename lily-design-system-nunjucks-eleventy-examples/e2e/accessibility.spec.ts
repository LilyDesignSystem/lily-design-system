import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG conformance smoke check across the Nunjucks + Eleventy examples app.
// Static-site routes use trailing slashes (/components/{slug}/).

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// base.njk injects the managed theme <link> from a pre-paint <script> so it
// can read the persisted theme slug before first paint, which means the
// stylesheet itself finishes loading asynchronously, after `page.goto()`
// resolves. Scanning before it applies catches picker glyphs still in their
// pre-theme state (e.g. white text with no themed button background yet),
// an intermittent false failure unrelated to page content. Wait for the
// managed link's sheet to have rules before running axe.
async function waitForTheme(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const link = document.querySelector('link[data-lily-theme-picker]') as HTMLLinkElement | null;
    if (!link) return false;
    try {
      return !!(link.sheet && link.sheet.cssRules && link.sheet.cssRules.length > 0);
    } catch {
      return true;
    }
  });
  // The sheet existing doesn't guarantee the browser has finished style
  // recalc/layout for it yet; give it two frames to settle.
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function expectNoViolations(page: import('@playwright/test').Page, label: string) {
  await waitForTheme(page);
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
    test(`/components/${slug}/`, async ({ page }) => {
      const res = await page.goto(`/components/${slug}/`);
      if (res && res.status() === 404) {
        test.skip(true, `Component page not built: ${slug}`);
      }
      await expectNoViolations(page, `/components/${slug}/`);
    });
  }
});

// Plan P6-T1: parity backfill. These 12 routes exist in all seven
// example apps (AGENTS/examples.md); this app had none until now.
const composedPages = [
  'contact-form',
  'dashboard',
  'dialog-flow',
  'file-upload-form',
  'navigation-and-menus',
  'page-layout',
  'rating-and-feedback',
  'search-and-filter',
  'settings-page',
  'tabbed-interface',
  'task-management',
  'timeline-and-cards',
  // Plan P6-T3: the "book an appointment" flagship composed-page pattern.
  // See e2e/book-an-appointment.spec.ts for the dedicated per-step sweep.
  'book-an-appointment',
];

test.describe('accessibility: composed-page demos', () => {
  for (const route of composedPages) {
    test(`/${route}/`, async ({ page }) => {
      const res = await page.goto(`/${route}/`);
      if (res && res.status() === 404) {
        test.skip(true, `Composed page not built: ${route}`);
      }
      await expectNoViolations(page, `/${route}/`);
    });
  }
});
