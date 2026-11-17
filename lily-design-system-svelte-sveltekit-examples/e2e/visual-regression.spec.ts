import { test, expect } from "@playwright/test";

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
    "united-kingdom-national-health-service-england-for-patients",
    "united-kingdom-government-digital-service",
    "dark",
] as const;

const SLUGS = [
    // content
    "alert",
    "information-callout",
    "feature-card",
    // national identifiers
    "united-kingdom-national-insurance-number-input",
    "united-kingdom-national-insurance-number-view",
    "australia-individual-healthcare-identifier-input",
    // forms
    "text-input",
    "select",
    "checkbox-group",
    // navigation
    "breadcrumb-nav",
    "pagination-nav",
    "tab-bar",
    "accordion-nav",
    // lists
    "summary-list",
    "task-list",
    "timeline-list",
    // tables
    "data-table",
    "calendar-table",
    "kanban-table",
    // links
    "back-link",
    // pickers
    "five-star-rating-radio-group",
    "color-radio-group",
    // overlays
    "dialog",
    "alert-dialog",
    // media
    "figure",
    "avatar-image",
    // buttons
    "button",
    "toggle-button",
    // data-viz
    "bar-chart",
    "meter",
    // P35-T1: healthcare display components and the parts changed since the baseline
    "observation-view",
    "allergy-record-list",
    "medication-view",
    "decision-support-card",
    "early-warning-score-view",
    "age-view",
    "duration-view",
    "record-list",
    "international-patient-summary",
    "body-map",
    "numeric-rating-scale-picker",
    "red-amber-green-radio-group",
    "signature-pad",
    "sparkline",
    "file-upload",
    // P35-T1: forms, overlays, navigation, content and charts not covered above
    "combobox",
    "date-field",
    "text-area-input",
    "radio-group",
    "switch-button",
    "wheel-picker",
    "error-summary",
    "warning-text",
    "tag",
    "badge",
    "card",
    "progress",
    "dropdown-menu",
    "tree-nav",
    "step-list",
    "pie-chart",
    "line-chart",
] as const;

// P35-T1: states and layouts the per-component baseline cannot see, in the
// app's default theme only. Each is one screenshot.
const DEFAULT_THEME = THEMES[0];

// Keyboard focus: the focus-ring contract (AGENTS/theme.md), on the first
// focusable element in each demo.
const FOCUS_SLUGS = [
    "button",
    "text-input",
    "checkbox-group",
    "back-link",
    "select",
    "tab-bar",
] as const;

// Narrow width: reflow at 320 CSS pixels (WCAG 1.4.10).
const NARROW_SLUGS = [
    "summary-list",
    "data-table",
    "breadcrumb-nav",
    "pagination-nav",
    "international-patient-summary",
    "allergy-record-list",
] as const;

// Right to left: the same demo under dir="rtl", so a physical property in a
// theme shows as a mirrored-layout diff.
const RTL_SLUGS = [
    "breadcrumb-nav",
    "pagination-nav",
    "summary-list",
    "text-input",
    "alert",
    "step-list",
] as const;

// Composed pages, the main landmark only.
const PAGES = [
    "patient-banner",
    "patient-summary",
    "ward-board",
    "flow-board",
    "find-patient",
    "settings-page",
] as const;

async function useTheme(page: import("@playwright/test").Page, theme: string) {
    await page.addInitScript((t) => {
        window.localStorage.setItem("lily-theme", t);
    }, theme);
}

async function waitForTheme(page: import("@playwright/test").Page) {
    await page.waitForFunction(() => {
        const link = document.querySelector(
            'link[data-lily-theme-picker="theme"]',
        ) as HTMLLinkElement | null;
        if (!link) return false;
        try {
            return !!(link.sheet && link.sheet.cssRules && link.sheet.cssRules.length > 0);
        } catch {
            return true;
        }
    });
    await page.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );
}

test.describe("visual regression baseline (P7-T5)", () => {
    for (const theme of THEMES) {
        test.describe(`theme: ${theme}`, () => {
            for (const slug of SLUGS) {
                test(`${slug}`, async ({ page }) => {
                    await useTheme(page, theme);
                    await page.goto(`/components/${slug}`);
                    await waitForTheme(page);
                    const demo = page.locator("main .card").first();
                    // Font rendering differs per OS, so the baseline is inherently
                    // platform-specific -- included explicitly (rather than relying
                    // on Playwright's implicit platform suffix) because an explicit
                    // snapshot name here would otherwise disable that suffixing.
                    await expect(demo).toHaveScreenshot(
                        `${slug}--${theme}-${process.platform}.png`,
                    );
                });
            }
        });
    }
});

test.describe("visual regression: states and layouts (P35-T1)", () => {
    for (const slug of FOCUS_SLUGS) {
        test(`focus: ${slug}`, async ({ page }) => {
            await useTheme(page, DEFAULT_THEME);
            await page.goto(`/components/${slug}`);
            await waitForTheme(page);
            const demo = page.locator("main .card").first();
            const target = demo
                .locator("a[href], button, input, select, textarea, [tabindex='0']")
                .first();
            // A key press first, so the programmatic focus that follows matches
            // :focus-visible as keyboard focus would.
            await page.keyboard.press("Shift");
            await target.focus();
            await expect(target).toBeFocused();
            await expect(demo).toHaveScreenshot(`focus-${slug}-${process.platform}.png`);
        });
    }

    test.describe("320px", () => {
        test.use({ viewport: { width: 320, height: 800 } });
        for (const slug of NARROW_SLUGS) {
            test(`narrow: ${slug}`, async ({ page }) => {
                await useTheme(page, DEFAULT_THEME);
                await page.goto(`/components/${slug}`);
                await waitForTheme(page);
                await expect(page.locator("main .card").first()).toHaveScreenshot(
                    `narrow-${slug}-${process.platform}.png`,
                );
            });
        }
    });

    for (const slug of RTL_SLUGS) {
        test(`rtl: ${slug}`, async ({ page }) => {
            await useTheme(page, DEFAULT_THEME);
            await page.goto(`/components/${slug}`);
            await waitForTheme(page);
            const demo = page.locator("main .card").first();
            await demo.evaluate((el) => el.setAttribute("dir", "rtl"));
            await page.evaluate(
                () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
            );
            await expect(demo).toHaveScreenshot(`rtl-${slug}-${process.platform}.png`);
        });
    }

    for (const route of PAGES) {
        test(`page: ${route}`, async ({ page }) => {
            await useTheme(page, DEFAULT_THEME);
            await page.goto(`/${route}`);
            await waitForTheme(page);
            await expect(page.locator("main")).toHaveScreenshot(
                `page-${route}-${process.platform}.png`,
            );
        });
    }
});
