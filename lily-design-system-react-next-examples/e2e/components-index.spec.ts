import { test, expect } from "@playwright/test";
import { components } from "../app/data/components";
import { suffixPatternOf } from "../app/data/suffix-pattern";

// Plan P6-T5: the /components search's category + suffix-pattern
// filters, layered on top of the existing free-text search. Expected
// counts are computed here from the same canonical data the page
// itself reads (app/data/{components,suffix-pattern}.ts), so a future
// catalog change can't silently drift this test out of sync with
// reality the way a hardcoded number would.

const TOTAL = components.length;
const tableSlugs = new Set(components.filter((c) => c.category === "tables").map((c) => c.slug));
const listItemSlugs = new Set(
    components.filter((c) => suffixPatternOf(c.slug) === "list-item").map((c) => c.slug),
);
const taskListItemSlugs = new Set(
    [...listItemSlugs].filter(
        (slug) =>
            slug.includes("task") && components.find((c) => c.slug === slug)?.category === "lists",
    ),
);

function slugFromHref(href: string | null): string {
    return (href ?? "").replace("/components/", "");
}

test.describe("/components search filters", () => {
    test("search narrows the list and clear resets it", async ({ page }) => {
        await page.goto("/components");
        await expect(page.getByRole("status")).toContainText(`${TOTAL} of ${TOTAL} components`);

        await page.getByLabel("Filter components").fill("breadcrumb");
        const status = await page.getByRole("status").textContent();
        const match = status?.match(/(\d+) of \d+ components/);
        expect(match).toBeTruthy();
        const shown = Number(match![1]);
        expect(shown).toBeGreaterThan(0);
        expect(shown).toBeLessThan(TOTAL);

        const items = page.locator('a[href^="/components/"]');
        expect(await items.count()).toBe(shown);
        for (let i = 0; i < shown; i++) {
            await expect(items.nth(i)).toContainText(/breadcrumb/i);
        }

        await page.getByRole("button", { name: "Clear filters" }).click();
        await expect(page.getByRole("status")).toContainText(`${TOTAL} of ${TOTAL} components`);
    });

    test("category filter shows exactly the components in that category", async ({ page }) => {
        await page.goto("/components");
        await page.getByLabel("Category").selectOption("tables");

        const items = page.locator('a[href^="/components/"]');
        expect(await items.count()).toBe(tableSlugs.size);

        const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
        for (const href of hrefs) {
            expect(tableSlugs.has(slugFromHref(href))).toBe(true);
        }
    });

    test("suffix-pattern filter shows exactly the slugs ending in that suffix", async ({
        page,
    }) => {
        await page.goto("/components");
        await page.getByLabel("Suffix pattern").selectOption("list-item");

        const items = page.locator('a[href^="/components/"]');
        expect(await items.count()).toBe(listItemSlugs.size);

        const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
        for (const href of hrefs) {
            expect(listItemSlugs.has(slugFromHref(href))).toBe(true);
        }
    });

    test("category, suffix-pattern, and search combine as an intersection", async ({ page }) => {
        test.skip(taskListItemSlugs.size === 0, "no task list item in the current catalog");

        await page.goto("/components");
        await page.getByLabel("Category").selectOption("lists");
        await page.getByLabel("Suffix pattern").selectOption("list-item");
        await page.getByLabel("Filter components").fill("task");

        const items = page.locator('a[href^="/components/"]');
        const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
        expect(hrefs.map(slugFromHref).sort()).toEqual([...taskListItemSlugs].sort());

        await page.getByRole("button", { name: "Clear filters" }).click();
        await expect(page.getByLabel("Category")).toHaveValue("");
        await expect(page.getByLabel("Suffix pattern")).toHaveValue("");
        await expect(page.getByLabel("Filter components")).toHaveValue("");
        await expect(page.getByRole("status")).toContainText(`${TOTAL} of ${TOTAL} components`);
    });
});
