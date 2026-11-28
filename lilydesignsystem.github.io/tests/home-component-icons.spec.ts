import { expect, test } from "@playwright/test";

// The home page's row of featured components: twelve SVG icons with one-word names and More, no bullets, on one row from
// about 810px wide with the framework row's spacing, wrapping without sideways scroll on a phone. On the English and a translated home
// page.
const NAMES = [
    "Link",
    "Avatar",
    "Chart",
    "Calendar",
    "Chat",
    "Data",
    "Gantt",
    "Kanban",
    "Locale",
    "Search",
    "Settings",
    "Theme",
    "More",
];

for (const path of ["/", "/de-de/"]) {
    test(`${path} shows the featured components as one row of SVG icons`, async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 900 });
        await page.goto(path);
        const row = page.locator(".component-icon-row");
        await expect(row.locator("li")).toHaveCount(NAMES.length);
        await expect(row.locator("a span")).toHaveText(NAMES);
        for (const img of await row.locator("img").all()) {
            await expect(img).toHaveAttribute("src", /\/icon\.svg$/);
            expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
        }
        const look = await row.evaluate((ul) => ({
            list: getComputedStyle(ul).listStyleType,
            items: [...ul.querySelectorAll("li")].map((li) => getComputedStyle(li).listStyleType),
            rows: new Set(
                [...ul.querySelectorAll("li")].map((li) =>
                    Math.round(li.getBoundingClientRect().top),
                ),
            ).size,
        }));
        expect(look.list).toBe("none");
        expect(new Set(look.items)).toEqual(new Set(["none"]));
        expect(look.rows).toBe(1);
        // The same spacing as the framework row: each icon sits above its framework icon.
        const lefts = async (sel: string) =>
            page
                .locator(sel)
                .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().left)));
        expect(await lefts(".component-icon-row > li")).toEqual(
            await lefts(".framework-icon-row > li"),
        );
        await page.setViewportSize({ width: 320, height: 800 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true,
        );
    });
}
