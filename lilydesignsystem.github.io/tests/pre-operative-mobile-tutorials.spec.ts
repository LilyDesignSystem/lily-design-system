import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The pre-operative assessment on phones (tasks.md P62-T4): the web tutorial's questionnaire and rules on each platform. Each
// page has its screenshot, with a text alternative, and its code, and the web tutorial links it.
const PLATFORMS = [
    {
        slug: "swift",
        title: "Pre-operative assessment in Swift",
        file: "PreOperativeAssessment/Rules.swift",
    },
    {
        slug: "kotlin",
        title: "Pre-operative assessment in Kotlin",
        file: "pre-operative-assessment/src/main/kotlin/com/example/preoperativeassessment/Rules.kt",
    },
];
const BASE = "/tutorials/pre-operative-assessment-by-patient";

for (const { slug, title, file } of PLATFORMS) {
    test(`${BASE}/${slug}/ has its screenshot and its code`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await page.goto(`${BASE}/${slug}/`);
        const main = page.locator("main");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
        const shot = main.locator(`img[src="/assets/images${BASE}/${slug}.png"]`);
        await expect(shot).toBeVisible();
        await expect(shot).toHaveAttribute("alt", /Before your operation/);
        expect(await shot.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
        await expect(main.locator(`pre[data-file="${file}"]`)).toBeVisible();
        for (const pre of await main.locator("pre").all())
            await expect(pre).toHaveAttribute("tabindex", "0");
        await expect(main.locator(`a[href="${BASE}/"]`).first()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true,
        );
        const { violations } = await new AxeBuilder({ page })
            .include("main")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(violations.map((v) => v.id)).toEqual([]);
    });
}

test("the web tutorial links each platform once", async ({ page }) => {
    await page.goto(`${BASE}/`);
    for (const { slug } of PLATFORMS)
        await expect(page.locator(`main a[href="${BASE}/${slug}/"]`)).toHaveCount(1);
});
