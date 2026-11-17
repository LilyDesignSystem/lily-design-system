import { test, expect } from "@playwright/test";

// The motion recipes (docs/patterns/motion, tasks.md P32-T3), with reduced motion emulated: nothing animates, nothing is
// hidden, the copies are hidden once, the pause is a real toggle, and the theme still changes.

test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
    await page.goto("/motion-recipes");
});

test("marquee: still, its copy hidden once, and a real pause toggle", async ({ page }) => {
    const marquee = page.getByRole("region", { name: "Our partner clinics" });
    const track = marquee.locator(".motion-marquee-track");
    await expect(track).toHaveCSS("animation-name", "none");
    await expect(marquee.getByRole("listitem")).toHaveCount(5);
    const copy = marquee.locator(".motion-marquee-list").nth(1);
    await expect(copy).toHaveAttribute("aria-hidden", "true");
    await expect(copy).toHaveAttribute("inert", "");
    const pause = marquee.getByRole("button", { name: "Pause the clinic list" });
    await expect(pause).toHaveAttribute("aria-pressed", "false");
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await expect(marquee).toHaveAttribute("data-paused", "");
});

test("marquee: still at 320px, every item wraps into view and none is clipped", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 640 });
    const marquee = page.getByRole("region", { name: "Our partner clinics" });
    const viewport = marquee.locator(".motion-marquee-viewport");
    const clipped = await viewport.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(clipped).toBe(false);
    for (const item of await marquee
        .locator(".motion-marquee-list")
        .first()
        .getByRole("listitem")
        .all()) {
        const box = await item.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }
});

test("a number that changes: the real value at once, and no animation", async ({ page }) => {
    const value = page.locator(".motion-statistic .statistic-value");
    await expect(value).toHaveText("12");
    await page.getByRole("button", { name: "Add a patient" }).click();
    await expect(value).toHaveText("13");
    await expect(value).toHaveAttribute("aria-live", "polite");
    await expect(value).toHaveCSS("animation-name", "none");
});

test("ease in: never hidden or faded, and still under reduced motion", async ({ page }) => {
    const card = page.locator(".motion-fade-in");
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("opacity", "1");
    await expect(card).toHaveCSS("animation-name", "none");
    await expect(card.getByRole("link", { name: "A link inside it" })).toBeVisible();
});

test("theme transition: applies at once and starts no view transition", async ({ page }) => {
    await page.evaluate(() => {
        const w = window as Window & { transitions?: number };
        w.transitions = 0;
        const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
        if (doc.startViewTransition) {
            const original = doc.startViewTransition.bind(document);
            doc.startViewTransition = (cb: () => void) => {
                w.transitions = (w.transitions ?? 0) + 1;
                return original(cb);
            };
        }
    });
    const box = page.locator(".motion-theme-box");
    await expect(box).toHaveAttribute("data-demo-theme", "light");
    await page.getByRole("button", { name: "Switch the panel's theme" }).click();
    await expect(box).toHaveAttribute("data-demo-theme", "dark");
    expect(
        await page.evaluate(() => (window as Window & { transitions?: number }).transitions),
    ).toBe(0);
});

test("terminal transcript: the prompt is not in the text, and the block is a named scroll region", async ({
    page,
}) => {
    const block = page.locator("pre.motion-terminal");
    await expect(block).toHaveAttribute("tabindex", "0");
    await expect(block).toHaveAccessibleName("Installing the Svelte catalog");
    const text = await block.textContent();
    expect(text).toContain("npm install @lilydesignsystem/svelte-headless");
    expect(text).not.toContain("$");
    const prompt = await block
        .locator("kbd")
        .evaluate((el) => getComputedStyle(el, "::before").content);
    expect(prompt).toContain("$");
});
