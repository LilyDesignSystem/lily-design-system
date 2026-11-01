import { test, expect, type Page } from "@playwright/test";

// Overflow navigation in Blazor (plan P18-T3; spec/dhcw-design-system-lessons
// item 2), the same assertions as the SvelteKit app's spec (P18-T2). Runs the
// real NavigationMenu with Overflow on /demos/overflow-navigation, whose
// measuring is the collocated NavigationMenu.razor.js loaded through JS interop
// after the first interactive render (the prerendered HTML has no script). The
// More button gains aria-controls only when that module attaches, so waiting
// for it proves the interop ran. Eight links (Home, Appointments,
// Prescriptions, Test results, Messages, Health record, Settings, Help), in
// Chromium, Firefox and WebKit.
//
// What IS asserted:
//   - at 1200, 420 and 320 CSS px wide, how many links stay in the row (the
//     counts below were measured, not taken from the spec), that the rest are
//     in the More list in their original order, that the More item shows only
//     while something overflows, and that the row really is one row;
//   - the More button toggles aria-expanded; Escape, pressed on a moved link,
//     closes the list and returns focus to the button;
//   - the opened list is in normal flow: position static, and the paragraph
//     after the navigation moves down by at least the list's height and starts
//     below the list's bottom (it is pushed, not covered);
//   - with JavaScript disabled, at 320px: no document-level horizontal scroll,
//     the More item stays hidden and all eight links are visible (they wrap).
// What is NOT asserted: the default theme's colours or the exact pixel widths
// (counts depend on the theme's font and padding: NHS England for patients);
// a click outside closing the list (unit-tested in each headless library).

const route = "/demos/overflow-navigation";
const ALL = [
    "Home",
    "Appointments",
    "Prescriptions",
    "Test results",
    "Messages",
    "Health record",
    "Settings",
    "Help",
];
// Measured 2026-10-29 with the default theme, identical in all three engines.
// The list is 960px wide at 1200 (.page-wrapper max), 372px at 420 and 272px
// at 320; the links are 51, 116, 110, 96, 87, 114, 69 and 39px wide with an
// 8px gap, and the More item is 61px. So all eight fit at 1200 (no More item).
const FIT: Record<number, number> = { 1200: 8, 420: 3, 320: 2 };

async function rowState(page: Page) {
    return page.evaluate(() => {
        const nav = document.querySelector<HTMLElement>('[data-overflow="true"]')!;
        const list = nav.querySelector<HTMLElement>(".navigation-menu-list")!;
        const more = list.querySelector<HTMLElement>(":scope > .navigation-menu-more")!;
        const moreList = more.querySelector<HTMLElement>(".navigation-menu-more-list")!;
        const inRow = (Array.from(list.children) as HTMLElement[]).filter((li) => li !== more);
        const tops = inRow.map((li) => Math.round(li.getBoundingClientRect().top));
        return {
            row: inRow.map((li) => li.textContent!.trim()),
            moved: (Array.from(moreList.children) as HTMLElement[]).map((li) =>
                li.textContent!.trim(),
            ),
            moreHidden: more.hidden,
            rowTops: [...new Set(tops)],
            moreTop: more.hidden ? null : Math.round(more.getBoundingClientRect().top),
        };
    });
}

async function gotoSettled(page: Page) {
    await page.goto(route);
    await page.waitForFunction(
        () => (window as unknown as { Blazor?: unknown }).Blazor !== undefined,
    );
    // The ResizeObserver has run once the More button has aria-controls.
    await expect(page.locator(".navigation-menu-more-button")).toHaveAttribute(
        "aria-controls",
        /.+/,
    );
}

for (const width of [1200, 420, 320]) {
    test(`overflow navigation: ${FIT[width]} of 8 links fit at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await gotoSettled(page);
        const fit = FIT[width];
        await expect.poll(async () => (await rowState(page)).row.length).toBe(fit);
        const state = await rowState(page);
        expect(state.row).toEqual(ALL.slice(0, fit));
        expect(state.moved).toEqual(ALL.slice(fit));
        expect(state.moreHidden).toBe(fit === ALL.length);
        expect(state.rowTops, "the links left in the row are on one line").toHaveLength(1);
        if (state.moreTop !== null)
            expect(Math.abs(state.moreTop - state.rowTops[0])).toBeLessThanOrEqual(2);
    });
}

test("overflow navigation: Escape closes the More list and returns focus", async ({
    page,
    browserName,
}) => {
    await page.setViewportSize({ width: 420, height: 800 });
    await gotoSettled(page);
    const button = page.getByRole("button", { name: "More" });
    const moreList = page.locator(".navigation-menu-more-list");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(moreList).toBeVisible();
    // Tab into the first moved link (WebKit reaches links with Option+Tab, the macOS default).
    await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
    await expect(moreList.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(moreList).toBeHidden();
    await expect(button).toBeFocused();
});

test("overflow navigation: the opened list is in normal flow and pushes content down", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await gotoSettled(page);
    const below = page.getByTestId("content-below");
    const before = (await below.boundingBox())!;
    await page.getByRole("button", { name: "More" }).click();
    const moreList = page.locator(".navigation-menu-more-list");
    await expect(moreList).toBeVisible();
    expect(await moreList.evaluate((el) => getComputedStyle(el).position)).toBe("static");
    const list = (await moreList.boundingBox())!;
    const after = (await below.boundingBox())!;
    expect(after.y, "the content below moved down by the list's height").toBeGreaterThanOrEqual(
        before.y + list.height - 1,
    );
    expect(after.y, "the content below starts under the list").toBeGreaterThanOrEqual(
        list.y + list.height - 1,
    );
});

test.describe("overflow navigation: no JavaScript", () => {
    test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
    test("at 320px the links wrap with no horizontal overflow", async ({ page }) => {
        await page.goto(route);
        const overflow = await page.evaluate(() => ({
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
        }));
        expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth + 2);
        await expect(page.locator(".navigation-menu-more")).toBeHidden();
        const nav = page.getByRole("navigation", { name: "Main navigation" });
        for (const name of ALL) await expect(nav.getByRole("link", { name })).toBeVisible();
    });
});
