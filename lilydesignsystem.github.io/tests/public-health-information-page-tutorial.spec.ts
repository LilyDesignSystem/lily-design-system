import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The public health information page tutorial: bin/check-tutorials builds and drives the app; this checks the page itself.
test("/tutorials/public-health-information-page/ is a complete tutorial", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/tutorials/public-health-information-page/");
    const main = page.locator("main");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Public health information page tutorial",
    );
    await expect(main).toContainText("For learning only.");
    for (const shot of ["desktop", "phone"]) {
        const img = main.locator(
            `img[src="/assets/images/tutorials/public-health-information-page/${shot}.png"]`,
        );
        await expect(img).toHaveAttribute("alt", /The finished page/);
        await img.scrollIntoViewIfNeeded();
        expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(main.locator('pre[data-file="src/routes/+layout.svelte"]')).toContainText(
        '<script lang="ts">',
    );
    for (const pre of await main.locator("pre").all())
        await expect(pre).toHaveAttribute("tabindex", "0");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
    );
    const { violations } = await new AxeBuilder({ page })
        .include("main")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
    await page.goto("/tutorials/");
    await expect(
        page.locator('main a[href="/tutorials/public-health-information-page/"]'),
    ).toHaveCount(1);
});
