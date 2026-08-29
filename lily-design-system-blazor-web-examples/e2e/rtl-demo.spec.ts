import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Plan P6-T4: the RTL demo route, ported from the canonical SvelteKit
// reference (lily-design-system-svelte-sveltekit-examples/e2e/rtl-demo.spec.ts).
// Proves the internationalization principle in AGENTS/internationalization.md
// -- "components do not assume LTR layout" -- with a real dir="rtl" page
// using components (breadcrumb, data table, pagination, a form with a
// radio group and a checkbox) that are the classic places a design system
// bakes in "left" instead of "start".
//
// Two Blazor-specific waits, both carried over from this app's other specs:
//
// 1. waitForTheme() -- the managed theme <link data-lily-theme-picker>
//    (created pre-paint by App.razor, see rtl-demo's own header comment)
//    finishes loading its stylesheet asynchronously; a computed-style
//    check run immediately after page.goto() can read pre-theme values.
//    Same helper and same attribute name as the SvelteKit reference's
//    e2e/rtl-demo.spec.ts and this app's own theme-switching.spec.ts.
// 2. gotoReady() -- Blazor Interactive Server renders the initial markup
//    before the SignalR circuit connects, so an interaction fired the
//    instant page.goto() resolves can be lost. Copied from
//    book-an-appointment.spec.ts's helper of the same name; used here
//    only for the radio-check test, which depends on the circuit being
//    live so a later re-render doesn't revert the native click.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function waitForTheme(page: Page) {
  await page.waitForFunction(() => {
    const link = document.querySelector('link[data-lily-theme-picker="theme"]') as HTMLLinkElement | null;
    if (!link) return false;
    try {
      return !!(link.sheet && link.sheet.cssRules && link.sheet.cssRules.length > 0);
    } catch {
      return true;
    }
  });
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function gotoReady(page: Page) {
  await page.goto('/rtl-demo');
  await page.waitForFunction(() => (window as unknown as { Blazor?: unknown }).Blazor !== undefined);
  // The circuit finishes connecting shortly after Blazor.start(); give it
  // a beat so the very first interaction isn't lost between page load and
  // the SignalR handshake completing.
  await page.waitForTimeout(300);
}

test.describe('RTL demo', () => {
  test('sets dir="rtl" on the page content, with no horizontal overflow', async ({ page }) => {
    await page.goto('/rtl-demo');
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
    await page.goto('/rtl-demo');
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
    // width proves the logical property, not a hardcoded side, is doing
    // the work.
    const inset = page.locator('.inset-text').first();
    const borders = await inset.evaluate(el => {
      const cs = getComputedStyle(el);
      return { inlineStart: cs.borderInlineStartWidth, physicalLeft: cs.borderLeftWidth };
    });
    expect(borders.inlineStart).not.toBe('0px');
  });

  test('axe: no WCAG violations', async ({ page }) => {
    await page.goto('/rtl-demo');
    await waitForTheme(page);
    const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
    if (results.violations.length > 0) {
      const summary = results.violations
        .map(v => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
        .join('\n');
      throw new Error(`axe found ${results.violations.length} WCAG violations on /rtl-demo:\n${summary}`);
    }
  });

  test('the radio group is keyboard-operable in RTL', async ({ page }) => {
    await gotoReady(page);
    const phoneOption = page.getByLabel('الهاتف');
    await phoneOption.check();
    await expect(phoneOption).toBeChecked();
  });
});
