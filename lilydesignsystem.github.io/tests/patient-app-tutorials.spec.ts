import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The patient app tutorials: each page shows every screen on a phone and a tablet, with text alternatives, and its code;
// the index and the tutorials page link them.
const SCREENS = [
    "1-start",
    "2-home",
    "3-messages",
    "4-profile",
    "5-appointments",
    "6-prescriptions",
    "7-results",
];

const PLATFORMS = [
    {
        slug: "swift",
        title: "A patient app in Swift",
        alt: /The Swift app on an (iPhone|iPad): /,
        file: "PatientApp/AppShell.swift",
    },
    {
        slug: "kotlin",
        title: "A patient app in Kotlin",
        alt: /The Kotlin app on an Android (phone|tablet): /,
        file: "patient-app/src/main/kotlin/com/example/patientapp/AppShell.kt",
    },
    {
        slug: "maui",
        title: "A patient app in .NET MAUI",
        alt: /The \.NET MAUI app on an (iPhone|iPad): /,
        file: "MainPage.cs",
    },
];

for (const { slug, title, alt, file } of PLATFORMS) {
    test(`/tutorials/patient-app/${slug}/ shows each screen on a phone and a tablet, and its code`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await page.goto(`/tutorials/patient-app/${slug}/`);
        const main = page.locator("main");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
        for (const screen of SCREENS)
            for (const device of ["phone", "tablet"]) {
                const shot = main.locator(
                    `img[src="/assets/images/tutorials/patient-app/${slug}/${device}-${screen}.png"]`,
                );
                await expect(shot).toHaveCount(1);
                await expect(shot).toHaveAttribute("alt", alt);
                await shot.scrollIntoViewIfNeeded();
                expect(
                    await shot.evaluate((img: HTMLImageElement) => img.naturalWidth),
                ).toBeGreaterThan(0);
            }
        await expect(main.locator(`pre[data-file="${file}"]`)).toBeVisible();
        for (const pre of await main.locator("pre").all())
            await expect(pre).toHaveAttribute("tabindex", "0");
        // The look is a public-health theme's; no screenshot is of, or names, another body's app.
        await expect(main.locator('img[alt*="NHS"]')).toHaveCount(0);
        for (const other of PLATFORMS.filter((p) => p.slug !== slug))
            await expect(
                main.locator(`a[href="/tutorials/patient-app/${other.slug}/"]`),
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

test("the index and the tutorials page link the patient app", async ({ page }) => {
    await page.goto("/tutorials/patient-app/");
    for (const { slug } of PLATFORMS)
        await expect(page.locator(`main a[href="/tutorials/patient-app/${slug}/"]`)).toHaveCount(1);
    await page.goto("/tutorials/");
    await expect(page.locator('main a[href="/tutorials/patient-app/"]')).toHaveCount(1);
});
