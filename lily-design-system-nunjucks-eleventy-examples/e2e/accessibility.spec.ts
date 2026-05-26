import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG conformance smoke check across the Nunjucks + Eleventy examples app.
// Static-site routes use trailing slashes (/components/{slug}/).

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
    test(`/components/${slug}/`, async ({ page }) => {
      const res = await page.goto(`/components/${slug}/`);
      if (res && res.status() === 404) {
        test.skip(true, `Component page not built: ${slug}`);
      }
      await expectNoViolations(page, `/components/${slug}/`);
    });
  }
});
