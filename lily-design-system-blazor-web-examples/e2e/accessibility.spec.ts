import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG conformance smoke check across the Blazor Web examples app.
// See the SvelteKit examples app's accessibility.spec.ts for the rationale
// — this file mirrors that pattern for the Blazor route shape.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// P7-T17: two independent Blazor-circuit-timing races made this suite
// flaky, both root-caused by scanning before the interactive circuit
// finished its head/theme reconciliation:
//
// 1. `App.razor`'s inline bootstrap script creates the managed theme
//    <link> and appends it to <head> before first paint, but appending a
//    stylesheet link doesn't make the browser block painting on it the
//    way a static <link> in the original HTML does — the pre-rendered
//    markup can paint with no author styles at all for a few dozen
//    milliseconds before the theme CSS finishes loading. axe-core caught
//    this intermittently on /components/dialog (a real WCAG violation on
//    transiently-unstyled content, not on the settled page — verified:
//    the theme's real button colours contrast at ~7.3:1, comfortably
//    over the 4.5:1 AA floor).
// 2. `<HeadOutlet>` briefly clears `<title>` while the circuit reconciles
//    the head during startup, even on a route with no `<PageTitle>` of
//    its own (`/rtl-demo`) — the same circuit-timing flake class the
//    2026-08-26 sweep (§11.8) already fixed for the axe/responsive
//    suites; it just hadn't hit this suite until now.
//
// Wait for both to settle before scanning, matching the `gotoReady`
// pattern the interaction specs already use for the same circuit.
//
// Waiting for `document.title !== ''` alone isn't enough: the static
// default title in `App.razor`'s `<head>` is already non-empty at the
// first poll, so `waitForFunction` resolves immediately — and
// `<HeadOutlet>` can still clear the title a moment *after* that,
// while it reconciles the head during circuit startup. The settle
// timeout below (matching `book-an-appointment.spec.ts`'s `gotoReady`)
// gives that reconciliation a beat to finish before scanning, rather
// than racing to catch its first truthy instant.
async function gotoAndWaitForTheme(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => {
    const link = document.querySelector('link[data-lily-theme-picker]') as HTMLLinkElement | null;
    return link !== null && link.sheet !== null;
  });
  await page.waitForFunction(() => (window as unknown as { Blazor?: unknown }).Blazor !== undefined);
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
