// The keys the contracts say the browser handles (tasks.md P25-T5). bin/check-coverage.keys-allow.json records them as "native"
// because jsdom and bUnit do not run them, so this is where they are shown to work, on the rendered components.
import { expect, test } from "@playwright/test";

const value = (locator: import("@playwright/test").Locator) =>
    locator.evaluate((el: HTMLInputElement) => el.value);

async function stepsWith(page: import("@playwright/test").Page, slug: string, key: string) {
    await page.goto(`/components/${slug}/`);
    const input = page.locator(`main .${slug}`).first();
    await input.focus();
    await input.evaluate((el: HTMLInputElement) => {
        if (!el.value && el.type === "time") el.value = "09:30";
        if (!el.value && el.type === "week") el.value = "2026-W10";
        if (!el.value && el.type === "datetime-local") el.value = "2026-04-20T09:30";
    });
    const before = await value(input);
    await page.keyboard.press(key);
    expect(await value(input), `${key} changes ${slug}`).not.toBe(before);
}

for (const [slug, key] of [
    ["range-input", "ArrowRight"],
    ["time-picker-input", "ArrowUp"],
    ["week-input", "ArrowUp"],
    ["date-time-local-input", "ArrowUp"],
]) {
    test(`${key} changes a ${slug}`, async ({ page }) => {
        await stepsWith(page, slug, key);
    });
}

test("a typed letter changes a native select", async ({ page }) => {
    // Not arrows: on macOS they open a closed select's list instead of changing its value.
    await page.goto("/components/theme-select/");
    const select = page.locator("main select.theme-select").first();
    await select.focus();
    const options = await select.locator("option").allTextContents();
    const before = await value(select);
    const other = options.find((text) => text.trim() && !text.trim().toLowerCase().startsWith(before[0]))!;
    await page.keyboard.press(other.trim()[0].toLowerCase());
    expect(await value(select)).not.toBe(before);
});

test("Escape clears a search input", async ({ page }) => {
    await page.goto("/components/search-input/");
    const input = page.locator("main .search-input").first();
    await input.fill("clinics");
    await page.keyboard.press("Escape");
    expect(await value(input)).toBe("");
});

test("Escape closes an open popover", async ({ page }) => {
    await page.goto("/components/popover/");
    const trigger = page.locator('main button[popovertarget="pop-info"]');
    const panel = page.locator("main #pop-info");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
});

test("ArrowDown scrolls a focused scroll area", async ({ page }) => {
    await page.goto("/components/scroll-area/");
    const area = page.locator("main .scroll-area").first();
    await area.focus();
    await expect(area).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect.poll(() => area.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
});
