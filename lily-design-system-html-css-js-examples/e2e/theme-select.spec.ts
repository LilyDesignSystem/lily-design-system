import { test, expect } from "@playwright/test";

// The theme picker's native select variant (tasks.md P18-T12; RFC 3) on /demos/theme-select.html, in Chromium,
// Firefox and WebKit. The page's CSS styles the select with appearance: base-select inside
// @supports (appearance: base-select); browsers without it keep the ordinary native select.
//
// What IS asserted, in every engine (Chromium and current WebKit support base-select; Firefox does not):
//   - the picker renders one native <select> named "Choose a theme", and no button or listbox;
//   - the resolved default is selected and applied (managed <link> and data-theme);
//   - the select is reachable with Tab, choosing an option applies the theme and persists it across a reload;
//   - with base-select support (measured per engine with CSS.supports), the select's computed appearance is
//     base-select; without it, it is not, and the select still works the same.
// What is NOT asserted: the open picker's look, or the platform's own keyboard inside the open picker (it differs
// by engine and operating system: that is the point of the variant).

const route = "/demos/theme-select.html";

test.describe("theme picker: native select variant", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(route);
        await page.evaluate(() => localStorage.removeItem("lily-theme"));
        await page.reload();
    });

    test("renders a named native select, resolves and applies the default", async ({ page }) => {
        const select = page.getByRole("combobox", { name: "Choose a theme" });
        await expect(select).toHaveJSProperty("tagName", "SELECT");
        await expect(page.locator("theme-picker .theme-picker")).toHaveAttribute(
            "data-variant",
            "select",
        );
        await expect(page.locator("theme-picker button")).toHaveCount(0);
        await expect(page.getByRole("listbox")).toHaveCount(0);
        await expect(select).toHaveValue(
            "united-kingdom-national-health-service-england-for-patients",
        );
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "united-kingdom-national-health-service-england-for-patients",
        );
    });

    test("Tab reaches it; choosing an option applies the theme and persists across a reload", async ({
        page,
    }) => {
        const select = page.getByRole("combobox", { name: "Choose a theme" });
        // Focus the control just before it, then Tab: the select is one ordinary Tab stop.
        await page
            .locator("main p")
            .first()
            .evaluate((p) => {
                p.setAttribute("tabindex", "-1");
                p.focus();
            });
        await page.keyboard.press("Tab");
        await expect(select).toBeFocused();
        await select.selectOption("dark");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        await expect(page.locator('link[data-lily-theme-picker="theme"]')).toHaveAttribute(
            "href",
            /\/themes\/dark\.css$/,
        );
        await page.reload();
        await expect(page.getByRole("combobox", { name: "Choose a theme" })).toHaveValue("dark");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    });

    test("appearance: base-select where the engine supports it, the ordinary select where it does not", async ({
        page,
    }, testInfo) => {
        const select = page.getByRole("combobox", { name: "Choose a theme" });
        const supported = await page.evaluate(() => CSS.supports("appearance", "base-select"));
        const appearance = await select.evaluate((el) => getComputedStyle(el).appearance);
        testInfo.annotations.push({ type: "base-select", description: String(supported) });
        if (supported) expect(appearance).toBe("base-select");
        else expect(appearance).not.toBe("base-select");
        // Either way the select works.
        await select.selectOption("light");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    });

    test("without the base-select CSS (the page's @supports block removed) the plain select works the same", async ({
        page,
    }) => {
        // Chromium and current WebKit both support base-select, so this case shows, in every engine, that the
        // select does not depend on the enhancement; Firefox (no base-select on 2026-10-30) runs the real path.
        await page.evaluate(() =>
            document.querySelectorAll("head style").forEach((s) => s.remove()),
        );
        const select = page.getByRole("combobox", { name: "Choose a theme" });
        expect(await select.evaluate((el) => getComputedStyle(el).appearance)).not.toBe(
            "base-select",
        );
        await select.selectOption("dark");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        await select.focus();
        await expect(select).toBeFocused();
    });
});
