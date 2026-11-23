import { expect, test } from "@playwright/test";
import { THEMES } from "../src/lib/themes";

// spec/theme-picker, "Order of themes": one list, alphabetical by the name shown, in the page's language.

test("the theme picker lists all 65 themes alphabetically by the name shown, in one list", async ({
    page,
}) => {
    expect(THEMES).toHaveLength(65);
    await page.goto("/");
    await page.locator(".theme-picker-button").click();
    const names = await page.locator(".theme-picker-option").allTextContents();
    const shown = names.map((n) => n.trim());
    expect(shown).toHaveLength(65);
    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    expect(shown).toEqual([...shown].sort((a, b) => collator.compare(a, b)));
    // Not grouped by kind: a company theme sits among the generic ones, and "NHS England" sorts under N.
    expect(shown.indexOf("Adobe Spectrum")).toBeLessThan(shown.indexOf("Aqua"));
    expect(shown.indexOf("IBM Carbon")).toBeLessThan(shown.indexOf("Light"));
    expect(shown.indexOf("Light")).toBeLessThan(shown.indexOf("NHS England (patients)"));
});

test("choosing the first theme in the list applies it", async ({ page }) => {
    await page.goto("/");
    const button = page.locator(".theme-picker-button");
    await expect(async () => {
        if ((await button.getAttribute("aria-expanded")) !== "true") await button.click();
        await expect(button).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
    }).toPass({ timeout: 10000 });
    await page.locator(".theme-picker-option").first().click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", THEMES[0]);
});
