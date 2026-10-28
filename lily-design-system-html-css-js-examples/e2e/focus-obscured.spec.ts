import { test, expect } from "@playwright/test";

// Focus Not Obscured (WCAG 2.2 SC 2.4.11, AA) for fixed bars, on the HTML+CSS+JS
// examples app. Spec: spec/dhcw-design-system-lessons item 5.
//
// The contract under test: whatever fixes a bar to the viewport sets
// `--lily-fixed-bar-block-start` / `--lily-fixed-bar-block-end` on the root to
// the bar's height, and the shared "Focus not obscured" section of the theme
// turns them into `scroll-padding-block`, so the browser scrolls a keyboard-
// focused control clear of the bar.
//
// What IS asserted, on the /components index (a long page of links):
//   - the page is longer than the viewport (the case is meaningful), and half
//     a viewport of empty content is appended after the last control (an
//     author's page end; scroll-padding cannot scroll past the document end).
//   - a 4rem bar injected with `position: fixed; inset-inline: 0;
//     inset-block-end: 0` sits at the bottom of the viewport, and the root
//     custom property `--lily-fixed-bar-block-end` is set to its height.
//   - after tabbing (with the keyboard) from the last-but-one focusable
//     element, the LAST focusable element on the page has focus, and its
//     bounding box bottom is at or above the top of the bar: it is completely
//     above the bar, which is stricter than the 2.4.11 minimum ("not entirely
//     hidden").
// What is NOT asserted:
//   - a fixed bar at the top (the same mechanism, `-block-start`), the focus
//     ring's own visibility (2.4.13), or sticky headers that app code builds.
//   - the bar is injected by the test, not Lily's `sticky-promo-banner`
//     component; it exercises the theme contract the component relies on.

const route = "/components/";
const BAR_HEIGHT_PX = 64; // 4rem at the default 16px root font size

test("a fixed bottom bar does not obscure the last focusable element", async ({ page }) => {
    await page.goto(route);
    // Hydrating frameworks replace server-rendered nodes: inject only when idle.
    await page.waitForLoadState("networkidle");

    const viewportHeight = page.viewportSize()!.height;
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(scrollHeight, "the page must be longer than the viewport").toBeGreaterThan(
        viewportHeight * 2,
    );

    await page.evaluate((barHeight) => {
        const bar = document.createElement("div");
        bar.id = "test-fixed-bar";
        bar.setAttribute(
            "style",
            `position: fixed; inset-inline: 0; inset-block-end: 0; block-size: 4rem; z-index: 2147483647; background: #000;`,
        );
        document.body.appendChild(bar);
        // Content after the last control, as a real page has: scroll-padding
        // cannot scroll past the end of the document, so without it the last
        // control would sit at the viewport edge, under the bar, whatever the
        // custom property says.
        const spacer = document.createElement("div");
        spacer.setAttribute("style", "block-size: 50vh");
        document.body.appendChild(spacer);
        document.documentElement.style.setProperty("--lily-fixed-bar-block-end", `${barHeight}px`);
    }, BAR_HEIGHT_PX);

    const bar = page.locator("#test-fixed-bar");
    const barBox = (await bar.boundingBox())!;
    expect(barBox.height).toBeCloseTo(BAR_HEIGHT_PX, 0);
    expect(barBox.y + barBox.height).toBeCloseTo(viewportHeight, 0);

    // Tag the last two visible, tabbable elements outside the bar.
    const found = await page.evaluate(() => {
        const selector =
            'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
        const visible = [...document.querySelectorAll<HTMLElement>(selector)].filter(
            (el) =>
                !el.closest("#test-fixed-bar") &&
                el.tabIndex >= 0 &&
                el.getClientRects().length > 0 &&
                getComputedStyle(el).visibility !== "hidden",
        );
        if (visible.length < 2) return 0;
        visible[visible.length - 2].setAttribute("data-test-before-last", "");
        visible[visible.length - 1].setAttribute("data-test-last", "");
        return visible.length;
    });
    expect(found, "the page needs at least two focusable elements").toBeGreaterThan(1);

    // Scroll first so the last element lies wholly inside the bar's zone: it is
    // "visible" in the viewport yet hidden by the bar, so the browser scrolls
    // for it only when scroll-padding says the bar is in the way. Focus the
    // last-but-one without scrolling, then Tab to the last element.
    await page.evaluate(() => {
        document
            .querySelector<HTMLElement>("[data-test-before-last]")!
            .focus({ preventScroll: true });
        const target = document.querySelector<HTMLElement>("[data-test-last]")!;
        const bottom = target.getBoundingClientRect().bottom;
        window.scrollBy(0, bottom - (window.innerHeight - 8));
    });
    await page.keyboard.press("Tab");

    const last = page.locator("[data-test-last]");
    await expect(last).toBeFocused();
    const lastBox = (await last.boundingBox())!;
    const barTop = (await bar.boundingBox())!.y;
    expect(
        lastBox.y + lastBox.height,
        `last focusable bottom (${lastBox.y + lastBox.height}) must be at or above the bar top (${barTop})`,
    ).toBeLessThanOrEqual(barTop + 0.5);
});
