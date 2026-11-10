import { test, expect, type Page } from "@playwright/test";

// spec/detent-lessons, P26-T2 and P26-T5: the themes let the first and last options of a wheel-picker rest in the
// centre of its list, and the opt-in drum (class wheel-picker-drum) animates only with scroll-driven animation support
// and without reduced motion. jsdom cannot scroll or lay out, so this runs in a real browser.

const list = (page: Page) => page.locator("main .card .wheel-picker-list").first();

/** How far the option's middle is from the list's middle, after scrolling the list to `to` and letting snapping settle. */
async function offCentre(
    page: Page,
    to: "start" | "end",
    option: "first" | "last",
): Promise<number> {
    const el = list(page);
    await el.evaluate((node, edge) => {
        node.scrollTop = edge === "start" ? 0 : node.scrollHeight;
    }, to);
    await page.waitForTimeout(300);
    return el.evaluate((node, which) => {
        const options = node.querySelectorAll<HTMLElement>('[role="option"]');
        const target = which === "first" ? options[0] : options[options.length - 1];
        const box = node.getBoundingClientRect();
        const row = target.getBoundingClientRect();
        const listMiddle = box.top + node.clientTop + node.clientHeight / 2;
        return Math.abs(row.top + row.height / 2 - listMiddle);
    }, option);
}

test("the first and last options can rest in the centre", async ({ page }) => {
    await page.goto("/components/wheel-picker");
    await expect(list(page)).toBeVisible();
    expect(await offCentre(page, "start", "first")).toBeLessThanOrEqual(2);
    expect(await offCentre(page, "end", "last")).toBeLessThanOrEqual(2);
});

test("a horizontal wheel lets its first and last options rest in the centre too", async ({
    page,
}) => {
    await page.goto("/components/wheel-picker");
    const el = list(page);
    await expect(el).toBeVisible();
    await el.evaluate((node) => node.setAttribute("aria-orientation", "horizontal"));
    const off = (edge: "start" | "end") =>
        el.evaluate(async (node, to) => {
            node.scrollLeft = to === "start" ? -node.scrollWidth : node.scrollWidth;
            if (to === "start") node.scrollLeft = 0;
            await new Promise((resolve) => setTimeout(resolve, 300));
            const options = node.querySelectorAll<HTMLElement>('[role="option"]');
            const target = to === "start" ? options[0] : options[options.length - 1];
            const box = node.getBoundingClientRect();
            const row = target.getBoundingClientRect();
            return Math.abs(
                row.left + row.width / 2 - (box.left + node.clientLeft + node.clientWidth / 2),
            );
        }, edge);
    expect(await off("start")).toBeLessThanOrEqual(2);
    expect(await off("end")).toBeLessThanOrEqual(2);
});

/** The number of running animations on the options once the root carries the drum class. */
async function drumAnimations(page: Page): Promise<{ supported: boolean; count: number }> {
    await page.goto("/components/wheel-picker");
    await expect(list(page)).toBeVisible();
    return list(page).evaluate((node) => {
        node.parentElement!.classList.add("wheel-picker-drum");
        const options = [...node.querySelectorAll<HTMLElement>('[role="option"]')];
        return {
            supported: CSS.supports("animation-timeline: view()"),
            count: options.reduce((sum, option) => sum + option.getAnimations().length, 0),
        };
    });
}

test.describe("drum, motion allowed", () => {
    test.use({ reducedMotion: "no-preference" });
    test("the drum animates each option where scroll-driven animations exist", async ({ page }) => {
        const { supported, count } = await drumAnimations(page);
        test.skip(!supported, "this browser has no scroll-driven animations; the list stays flat");
        expect(count).toBeGreaterThan(0);
    });
});

test.describe("drum, reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("the drum does not animate with reduced motion", async ({ page }) => {
        const { count } = await drumAnimations(page);
        expect(count).toBe(0);
    });
});
