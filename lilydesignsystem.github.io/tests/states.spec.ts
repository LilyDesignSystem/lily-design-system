import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// /states renders every interactive class hook in each state the themes style (tasks.md P46-T7): it is a real page, so it is
// axe-clean in the light and dark themes, and each control has an accessible name.
for (const theme of ["light", "dark"]) {
    test(`/states/ has no axe violations in the ${theme} theme`, async ({ page }) => {
        await page.addInitScript((slug) => localStorage.setItem("lily-theme", slug), theme);
        await page.goto("/states/");
        await page.waitForLoadState("networkidle");
        await page.evaluate(
            (slug) => document.documentElement.setAttribute("data-theme", slug),
            theme,
        );
        await page.waitForTimeout(200);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Component states");
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
}

test("/states/ shows disabled, pressed and invalid controls", async ({ page }) => {
    await page.goto("/states/");
    await expect(page.locator("main button[disabled]").first()).toBeDisabled();
    await expect(page.locator('main [aria-pressed="true"]').first()).toBeVisible();
    await expect(page.locator('main [aria-invalid="true"]').first()).toBeVisible();
});
