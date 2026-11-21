import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Whole pages, header and footer included, on the site's main routes. The other site tests scope axe to their own
// part of a page; the shared header's label-in-name failure (2026-11-21) went unseen on every page until a test ran
// axe over all of one.
const ROUTES = [
    "/",
    "/about/",
    "/help/",
    "/getting-started/",
    "/tutorials/",
    "/components/",
    "/components/card/",
    "/recipes/",
    "/optimize/",
    "/quality/",
    "/es-001/",
];

for (const path of ROUTES) {
    test(`${path} passes axe over the whole page`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(results.violations).toEqual([]);
    });
}
