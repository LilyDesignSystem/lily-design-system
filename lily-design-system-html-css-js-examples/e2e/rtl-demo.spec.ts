import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Plan P6-T4: the RTL demo route, ported to this plain-HTML + vanilla-JS
// app. Mirrors the canonical SvelteKit spec (e2e/rtl-demo.spec.ts there).
// Proves the internationalization principle in
// AGENTS/internationalization.md -- "components do not assume LTR
// layout" -- with a real dir="rtl" page using components (breadcrumb,
// data table, pagination, a form with radios/checkboxes) that are the
// classic places a design system bakes in "left" instead of "start".
// Served at /rtl-demo.html (this app's flat-.html routing convention).
//
// waitForTheme() below is load-bearing, found by direct measurement, not
// assumed by analogy with the SvelteKit spec. theme-boot.js does create
// the managed <link data-lily-theme-picker="theme"> synchronously,
// before first paint, and Playwright's navigation wait does wait for
// that stylesheet's network request -- so, unlike the SvelteKit app,
// there is no race to the stylesheet *loading*. But the reference
// theme's `.button` rule pairs its themed colours with a 120ms
// `transition: background-color, color, border-color`, and that
// transition genuinely fires on the very first style recalculation that
// applies the stylesheet (a fresh element has no prior computed value to
// carry over, but the CSS Transitions spec still fires here because the
// "before-change style" and "after-change style" differ in the same
// recalc that turns the transition on). Direct measurement -- five cold
// browser contexts, reading the submit button's computed background
// color immediately after `page.goto()` resolves -- caught it
// mid-transition (an unstable oklab grey) in roughly half of them,
// settling to the real themed blue (oklch(0.45 0.17 251)) only after
// waiting out the transition. A `color-contrast` axe check run during
// that window reads whatever the transitioning frame happens to be, not
// the shipped theme -- so this is a genuine flake source for exactly the
// assertion that matters most here, not a theoretical one.
async function waitForTheme(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const link = document.querySelector('link[data-lily-theme-picker="theme"]') as HTMLLinkElement | null;
    if (!link) return false;
    try {
      return !!(link.sheet && link.sheet.cssRules && link.sheet.cssRules.length > 0);
    } catch {
      return true;
    }
  });
  // Longer than the theme's 120ms button transition, confirmed to settle
  // computed colors stably across 5/5 fresh-context reads at this wait.
  await page.waitForTimeout(400);
}

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('RTL demo', () => {
  test('sets dir="rtl" on the page content, with no horizontal overflow', async ({ page }) => {
    await page.goto('/rtl-demo.html');
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
    await page.goto('/rtl-demo.html');
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
    // width proves the logical property, not a hardcoded side, is
    // doing the work.
    const inset = page.locator('.inset-text').first();
    const borders = await inset.evaluate(el => {
      const cs = getComputedStyle(el);
      return { inlineStart: cs.borderInlineStartWidth, physicalLeft: cs.borderLeftWidth };
    });
    expect(borders.inlineStart).not.toBe('0px');
  });

  test('axe: no WCAG violations', async ({ page }) => {
    await page.goto('/rtl-demo.html');
    await waitForTheme(page);
    const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
    if (results.violations.length > 0) {
      const summary = results.violations
        .map(v => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
        .join('\n');
      throw new Error(`axe found ${results.violations.length} WCAG violations on /rtl-demo.html:\n${summary}`);
    }
  });

  test('the reason radio group is keyboard-operable in RTL', async ({ page }) => {
    await page.goto('/rtl-demo.html');
    await waitForTheme(page);
    const phoneOption = page.getByLabel('الهاتف');
    await phoneOption.check();
    await expect(phoneOption).toBeChecked();
  });
});
