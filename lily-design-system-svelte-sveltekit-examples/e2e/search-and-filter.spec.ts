import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The waiting-time filter on /search-and-filter: range-fieldset in a composed page (tasks.md P35-T5), driven by keyboard in
// a real browser, where the native range keys and the clamp at the other thumb meet.

test.describe("search and filter, waiting time", () => {
    test("the thumbs filter the results by keyboard and stop at each other", async ({ page }) => {
        await page.goto("/search-and-filter");
        const group = page.getByRole("group", { name: "Waiting time, in weeks" });
        const lower = group.getByRole("slider", { name: "Shortest wait, in weeks" });
        const upper = group.getByRole("slider", { name: "Longest wait, in weeks" });
        const rows = page.locator("table.data-table tbody tr");
        await expect(rows).toHaveCount(8);

        await lower.focus();
        for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
        await expect(lower).toHaveValue("5");
        await expect(page.getByText("From 5 to 20 weeks")).toBeVisible();
        // Paediatrics (3), Oncology (2) and Radiology (4) wait less than five weeks.
        await expect(rows).toHaveCount(5);

        await upper.focus();
        await page.keyboard.press("Home");
        await expect(upper).toHaveValue("5");
        await expect(page.getByText("From 5 to 5 weeks")).toBeVisible();
        await expect(rows).toHaveCount(0);

        await lower.focus();
        await page.keyboard.press("End");
        await expect(lower).toHaveValue("5");
    });

    test("has no axe violations", async ({ page }) => {
        await page.goto("/search-and-filter");
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
});
