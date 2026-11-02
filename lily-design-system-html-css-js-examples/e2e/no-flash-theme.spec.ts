import { test, expect } from "@playwright/test";

// P22-T2: the head snippet (assets/js/theme-boot.js) applies the stored theme before first paint, with no help from
// the theme-picker element. The picker script is blocked, so only the parser-blocking snippet can have done this.
test.describe("no flash of the default theme", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/assets/js/theme-picker.js", (route) => route.abort());
    });

    test("a stored theme is on the root and its stylesheet is linked before the picker loads", async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem("lily-theme", "dark"));
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        await expect(page.locator('link[data-lily-theme-picker="theme"]')).toHaveAttribute("href", "/themes/dark.css");
    });

    test("with nothing stored the default theme is applied the same way", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator("html")).toHaveAttribute("data-theme", /.+/);
        await expect(page.locator('link[data-lily-theme-picker="theme"]')).toHaveAttribute("href", /^\/themes\/.+\.css$/);
    });

    test("a malformed stored value is ignored", async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem("lily-theme", "../evil"));
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator('link[data-lily-theme-picker="theme"]')).not.toHaveAttribute("href", /evil/);
    });
});
