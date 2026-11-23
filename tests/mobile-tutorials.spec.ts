import { expect, test } from "@playwright/test";

// The Swift and Kotlin tutorials (tasks.md Phases 44 and 45): each says the package is early, names the
// real module or product it uses, links its sibling, and reflows at 320px with its code blocks reachable by keyboard.
const TUTORIALS = [
    {
        route: "/tutorials/swift/",
        title: "Swift tutorial",
        names: ["LilyUI", "LilyThemes"],
        sibling: "/tutorials/kotlin/",
    },
    {
        route: "/tutorials/kotlin/",
        title: "Kotlin tutorial",
        names: ["lily-compose", "lily-compose-themes"],
        sibling: "/tutorials/swift/",
    },
];

for (const t of TUTORIALS) {
    test(`${t.route} is a complete tutorial`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await page.goto(t.route);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(t.title);
        await expect(page.locator("main")).toContainText(/Early/);
        for (const name of t.names) await expect(page.locator("main")).toContainText(name);
        await expect(page.locator(`main a[href="${t.sibling}"]`)).toHaveCount(1);
        // Every code block is a focusable region, so it can be scrolled by keyboard.
        for (const pre of await page.locator("main pre").all()) {
            await expect(pre).toHaveAttribute("tabindex", "0");
        }
        // No horizontal scrolling of the page at 320 CSS pixels (WCAG 1.4.10): code scrolls inside its own block.
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
            ),
        ).toBe(true);
    });
}

test("the site map lists both tutorials", async ({ page }) => {
    await page.goto("/en-001/site-map/");
    await expect(page.locator('a[href="/tutorials/swift/"]')).toHaveCount(1);
    await expect(page.locator('a[href="/tutorials/kotlin/"]')).toHaveCount(1);
});

test("the tutorials index lists the Swift and Kotlin tutorials", async ({ page }) => {
    await page.goto("/tutorials/");
    for (const t of TUTORIALS) {
        await expect(page.locator(`main a.card[href="${t.route}"]`)).toBeVisible();
    }
});
