import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The book-an-appointment tutorials (tasks.md P62-T6): one phone screen in three platforms. Each page has its screenshot, with a
// text alternative, and its code; the index and the tutorials page link them.
const PLATFORMS = [
    {
        slug: "swift",
        title: "Book an appointment in Swift",
        file: "BookAppointment/AppShell.swift",
    },
    {
        slug: "kotlin",
        title: "Book an appointment in Kotlin",
        file: "book-appointment/build.gradle.kts",
    },
    { slug: "maui", title: "Book an appointment in .NET MAUI", file: "BookAppointmentPage.cs" },
];

for (const { slug, title, file } of PLATFORMS) {
    test(`/tutorials/book-appointment/${slug}/ has its screenshot and its code`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await page.goto(`/tutorials/book-appointment/${slug}/`);
        const main = page.locator("main");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
        const shot = main.locator(
            `img[src="/assets/images/tutorials/book-appointment/${slug}.png"]`,
        );
        await expect(shot).toBeVisible();
        await expect(shot).toHaveAttribute("alt", /Book an appointment/);
        expect(await shot.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
        await expect(main.locator(`pre[data-file="${file}"]`)).toBeVisible();
        for (const pre of await main.locator("pre").all())
            await expect(pre).toHaveAttribute("tabindex", "0");
        for (const other of PLATFORMS.filter((p) => p.slug !== slug))
            await expect(
                main.locator(`a[href="/tutorials/book-appointment/${other.slug}/"]`),
            ).toHaveCount(1);
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

test("the index and the tutorials page link the three", async ({ page }) => {
    await page.goto("/tutorials/book-appointment/");
    for (const { slug } of PLATFORMS)
        await expect(
            page.locator(`main a[href="/tutorials/book-appointment/${slug}/"]`),
        ).toHaveCount(1);
    await page.goto("/tutorials/");
    await expect(page.locator('main a[href="/tutorials/book-appointment/"]')).toHaveCount(1);
});
