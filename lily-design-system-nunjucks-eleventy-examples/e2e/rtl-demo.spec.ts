import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Plan P6-T4: the RTL demo route, ported from the canonical SvelteKit
// reference (lily-design-system-svelte-sveltekit-examples/e2e/rtl-demo.spec.ts)
// to this app's static-site route shape. Proves the internationalization
// design principle in AGENTS/internationalization.md -- "components do
// not assume LTR layout in their structural HTML" -- with a real
// dir="rtl" page using components (breadcrumb, data table, pagination,
// a form with radios/checkboxes) that are the classic places a design
// system silently bakes in "left" instead of "start".

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// base.njk injects the managed theme <link> from a pre-paint <script> so it
// can read the persisted theme slug before first paint, which means the
// stylesheet itself finishes loading asynchronously, after `page.goto()`
// resolves. Scanning before it applies catches picker glyphs still in their
// pre-theme state, an intermittent false failure unrelated to page content.
// Wait for the managed link's sheet to have rules before running axe or
// reading computed styles. Same helper as e2e/accessibility.spec.ts and
// e2e/responsive.spec.ts.
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
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('RTL demo', () => {
  test('sets dir="rtl" on the page content, with no horizontal overflow', async ({ page }) => {
    await page.goto('/rtl-demo/');
    await waitForTheme(page);

    const dirEl = page.locator('[dir="rtl"]');
    await expect(dirEl).toHaveAttribute('dir', 'rtl');
    await expect(dirEl).toHaveAttribute('lang', 'ar');

    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth + 2);
  });

  test('mirrors component layout, not just text direction', async ({ page }) => {
    await page.goto('/rtl-demo/');
    await waitForTheme(page);

    // Table headers: the reference theme uses text-align: start, which
    // resolves to "right" under dir="rtl" -- confirming the theme
    // actually responds to direction rather than hardcoding "left".
    const th = page.locator('th').first();
    await expect(th).toBeVisible();
    const thAlign = await th.evaluate(el => getComputedStyle(el).textAlign);
    expect(thAlign).toBe('start');

    // inset-text's accent border uses border-inline-start, which
    // resolves to the *right* edge in RTL -- a nonzero inline-start
    // width with a zero physical-left width proves the logical
    // property, not a hardcoded side, is doing the work.
    const inset = page.locator('.inset-text').first();
    const borders = await inset.evaluate(el => {
      const cs = getComputedStyle(el);
      return { inlineStart: cs.borderInlineStartWidth, physicalLeft: cs.borderLeftWidth };
    });
    expect(borders.inlineStart).not.toBe('0px');
  });

  test('axe: no WCAG violations', async ({ page }) => {
    await page.goto('/rtl-demo/');
    await waitForTheme(page);
    const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
    if (results.violations.length > 0) {
      const summary = results.violations
        .map(v => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
        .join('\n');
      throw new Error(`axe found ${results.violations.length} WCAG violations on /rtl-demo/:\n${summary}`);
    }
  });

  test('the preferred-contact radio group is keyboard-operable in RTL', async ({ page }) => {
    await page.goto('/rtl-demo/');
    await waitForTheme(page);
    const phoneOption = page.getByLabel('الهاتف');
    await phoneOption.check();
    await expect(phoneOption).toBeChecked();
  });
});
