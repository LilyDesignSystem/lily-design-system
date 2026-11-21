import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The shared site header, checked on its own: the other site tests scope axe to their page's content. The brand
// link is named by its visible text (WCAG 2.5.3, label in name); it had an aria-label that did not contain it.
for (const path of ["/", "/components/card/", "/es-001/"]) {
    test(`the header on ${path} passes axe`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
            .include("header.site-header")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(results.violations).toEqual([]);
    });
}

test("the brand link is named by its visible text and leads home", async ({ page }) => {
    await page.goto("/components/card/");
    const brand = page.locator("header.site-header a.site-brand");
    await expect(brand).toHaveAccessibleName("Lily Design System™");
    await expect(brand).not.toHaveAttribute("aria-label");
    await expect(brand).toHaveAttribute("href", "/");
});
