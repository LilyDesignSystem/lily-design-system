import { test, expect } from "@playwright/test";

// The macros' keys in a real browser, as a consumer gets them: the demo layout loads components/widget-init.js. The unit
// tests prove each key in jsdom. This proves the module graph loads, and that autoInit() ran, on a page that was served.

test("tool-bar: the arrows move between its buttons", async ({ page }) => {
    await page.goto("/components/tool-bar/");
    const buttons = page.locator(".tool-bar button");
    await buttons.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(buttons.nth(1)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(buttons.first()).toBeFocused();
});

test("scroll-bar: Page Down moves aria-valuenow", async ({ page }) => {
    await page.goto("/components/scroll-bar/");
    const bar = page.locator(".scroll-bar").first();
    await bar.focus();
    await page.keyboard.press("PageDown");
    await expect(bar).toHaveAttribute("aria-valuenow", "40");
    await page.keyboard.press("End");
    await expect(bar).toHaveAttribute("aria-valuenow", "100");
});

test("dial: Shift moves ten steps, and a plain arrow one", async ({ page }) => {
    await page.goto("/components/dial/");
    const dial = page.locator("input.dial").first();
    await dial.focus();
    await page.keyboard.press("Shift+ArrowRight");
    await expect(dial).toHaveValue("60");
    await page.keyboard.press("ArrowRight");
    await expect(dial).toHaveValue("61");
});
