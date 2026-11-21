import { readdirSync, readFileSync, existsSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

// spec/homepage: the hero, then exactly six tile cards immediately after it, in a grid of 1, 2, 3 or 6 columns, never 4 or 5.

// Every locale home: a route directory whose page renders LocaleHome. "/" is the English home.
const ROUTES = readdirSync("src/routes", { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(`src/routes/${d.name}/+page.svelte`))
    .filter((d) => readFileSync(`src/routes/${d.name}/+page.svelte`, "utf8").includes("LocaleHome"))
    .map((d) => `/${d.name}/`);
const HOMES = ["/", ...ROUTES];

// Widths of the four column counts, in CSS pixels.
const COLUMNS: [number, number][] = [
    [320, 1],
    [768, 2],
    [1280, 3],
    [1920, 6],
];

const tileColumns = (page: Page) =>
    page
        .locator(".tile-grid")
        .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);

test("there are locale homes to test", () => {
    expect(ROUTES.length).toBeGreaterThan(100);
});

for (const route of HOMES) {
    test(`${route} has exactly six tiles immediately after the hero, each one link`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await page.goto(route);
        // Nothing between the hero and the tiles: the tiles' section is the hero's next sibling.
        const sibling = page.locator(".page-intro + section.tile-section");
        await expect(sibling).toHaveCount(1);
        await expect(sibling.locator(".tile")).toHaveCount(6);
        await expect(page.locator(".tile")).toHaveCount(6);
        for (const tile of await sibling.locator(".tile").all()) {
            // One link, in the heading, with a non-empty name; one description; nothing else focusable.
            await expect(tile.locator("a")).toHaveCount(1);
            await expect(tile.locator("h3 > a")).toHaveCount(1);
            expect(((await tile.locator("a").textContent()) ?? "").trim()).not.toBe("");
            expect(((await tile.locator("p").textContent()) ?? "").trim()).not.toBe("");
            await expect(tile.locator("button, input, select, textarea, [tabindex]")).toHaveCount(
                0,
            );
        }
        // No blank text and no raw key on any tile.
        const text = (await sibling.innerText()).replace(/\s+/g, " ");
        expect(text).not.toMatch(/undefined|home\.|\{|\}/);
        // No horizontal scrolling at 320 CSS pixels.
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
            ),
        ).toBe(true);
    });
}

// The column counts, on the English home, a Welsh one, a right-to-left one and a language with no tile translations.
for (const route of ["/", "/en-us/", "/cy-gb/", "/ar-001/", "/ja-jp/"]) {
    test(`${route} tiles are 1, 2, 3 and 6 columns at 320, 768, 1280 and 1920 pixels`, async ({
        page,
    }) => {
        for (const [width, columns] of COLUMNS) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(route);
            expect(await tileColumns(page), `${width}px`).toBe(columns);
            // Never 4 or 5.
            expect([4, 5]).not.toContain(await tileColumns(page));
            // No orphan row: a column count divides the six tiles.
            expect(6 % (await tileColumns(page))).toBe(0);
        }
    });
}

test("the tiles do not scroll sideways at 400 percent zoom or at the largest text size", async ({
    page,
}) => {
    // 400 percent zoom of a 1280px window is a 320px viewport. Other content further down the English home may be wider
    // (code samples), so this reads the tiles, not the page.
    await page.setViewportSize({ width: 320, height: 800 });
    for (const route of ["/en-us/", "/cy-gb/", "/ar-001/"]) {
        await page.goto(route);
        await page.evaluate(() =>
            document.documentElement.setAttribute("data-text-size", "largest"),
        );
        const inside = await page.locator(".tile-section").evaluate((section) => {
            const w = document.documentElement.clientWidth;
            return (
                section.scrollWidth <= section.clientWidth &&
                [...section.querySelectorAll(".tile")].every((tile) => {
                    const r = tile.getBoundingClientRect();
                    return r.left >= -0.5 && r.right <= w + 0.5;
                })
            );
        });
        expect(inside, route).toBe(true);
        // The page as a whole is not asserted here: the hero's icon row still overflows at the largest text size (tasks.md P41-T8b).
    }
});

test("the whole tile is the link target", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en-us/");
    // A point in the description, away from the heading: the page's topmost element there is the tile's own link.
    const hit = await page.locator('.tile[data-tile="compare"]').evaluate((tile) => {
        tile.scrollIntoView({ block: "center" });
        const r = tile.querySelector(".card-description")!.getBoundingClientRect();
        const el = document.elementFromPoint(r.left + 8, r.top + r.height / 2);
        return {
            onLink: !!el?.closest("a.tile-link"),
            href: el?.closest("a")?.getAttribute("href"),
        };
    });
    expect(hit.onLink).toBe(true);
    expect(hit.href).toMatch(/compare/);
});

test("a language without a tile translation shows the English words", async ({ page }) => {
    await page.goto("/ja-jp/");
    await expect(page.locator('.tile[data-tile="styles"] h3')).toHaveText("Styles");
});
