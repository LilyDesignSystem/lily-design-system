import { test, expect } from '@playwright/test';

// Plan P7-T5 (stretch): a visual regression baseline over a representative
// slice of the catalog, across a spread of reference themes.
//
// Full 491 x 45 coverage is not the goal here (that's ~22,000 screenshots
// for one framework's one example app) -- this is a baseline that catches
// theme-CSS or component-markup regressions across the categories that
// actually differ visually: forms, navigation, lists, tables, links,
// pickers, overlays, media, buttons, data-viz, content, and one national
// identifier pair. 30 slugs x 3 themes = 90 screenshots.
//
// Themes: the app's actual default (NHS England for patients), the other
// major public-sector reference (GOV.UK GDS), and a general-purpose dark
// theme -- chosen so light and dark rendering are both represented, since
// the 45 reference themes are each a single fixed palette rather than a
// light/dark pair of the same theme (see AGENTS/theme.md).
//
// Each screenshot targets the .card demo region on /components/{slug},
// not the full page, so header/footer/nav chrome changes don't produce
// spurious diffs unrelated to the component or theme under test.
//
// Baseline commit: run with --update-snapshots once, commit the PNGs.
// Verify: a plain re-run reports zero diffs.

const THEMES = [
  'united-kingdom-national-health-service-england-for-patients',
  'united-kingdom-government-digital-service',
  'dark'
] as const;

const SLUGS = [
  // content
  'alert',
  'information-callout',
  'feature-card',
  // national identifiers
  'united-kingdom-national-insurance-number-input',
  'united-kingdom-national-insurance-number-view',
  'australia-individual-healthcare-identifier-input',
  // forms
  'text-input',
  'select',
  'checkbox-group',
  // navigation
  'breadcrumb-nav',
  'pagination-nav',
  'tab-bar',
  'accordion-nav',
  // lists
  'summary-list',
  'task-list',
  'timeline-list',
  // tables
  'data-table',
  'calendar-table',
  'kanban-table',
  // links
  'back-link',
  // pickers
  'five-star-rating-picker',
  'color-picker',
  // overlays
  'dialog',
  'alert-dialog',
  // media
  'figure',
  'avatar-image',
  // buttons
  'button',
  'toggle-button',
  // data-viz
  'bar-chart',
  'meter'
] as const;

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
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('visual regression baseline (P7-T5)', () => {
  for (const theme of THEMES) {
    test.describe(`theme: ${theme}`, () => {
      for (const slug of SLUGS) {
        test(`${slug}`, async ({ page }) => {
          await page.addInitScript((t) => {
            window.localStorage.setItem('lily-theme', t);
          }, theme);
          await page.goto(`/components/${slug}`);
          await waitForTheme(page);
          const demo = page.locator('main .card').first();
          // Font rendering differs per OS, so the baseline is inherently
          // platform-specific -- included explicitly (rather than relying
          // on Playwright's implicit platform suffix) because an explicit
          // snapshot name here would otherwise disable that suffixing.
          await expect(demo).toHaveScreenshot(`${slug}--${theme}-${process.platform}.png`);
        });
      }
    });
  }
});
