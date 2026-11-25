import { readdirSync } from "node:fs";
import { test, expect } from "@playwright/test";

// A plain table cell keeps its words and numbers whole from 48rem up, in every theme, even in a column squeezed by a long one
// (tasks.md P49-T19). Below that a cell outside a horizontal-scroller still wraps anywhere, so it cannot widen a narrow page.

const THEMES = readdirSync("static/themes")
    .filter((f) => f.endsWith(".css"))
    .map((f) => f.replace(/\.css$/, ""))
    .sort();

const PROSE = "A long description that takes every bit of the width it is given. ".repeat(8);

for (const theme of THEMES)
    test(`${theme}: a price and a time in a squeezed column are whole`, async ({ page }) => {
        await page.route("**/table-cell-words", (route) =>
            route.fulfill({
                contentType: "text/html",
                body: `<!doctype html><html lang="en"><head><title>Table</title><link rel="stylesheet" href="/themes/${theme}.css" /></head><body><main><table class="table"><thead><tr><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th></tr></thead><tbody><tr><td>1,499.00</td><td>${PROSE}</td><td>09:00</td></tr></tbody></table></main></body></html>`,
            }),
        );
        for (const width of [320, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/table-cell-words");
            const found = await page.evaluate(() => ({
                lines: [...document.querySelectorAll("td")].map((cell) => {
                    const range = document.createRange();
                    range.selectNodeContents(cell);
                    return new Set([...range.getClientRects()].map((box) => Math.round(box.top)))
                        .size;
                }),
                over: document.documentElement.scrollWidth - window.innerWidth,
            }));
            if (width >= 768) expect([found.lines[0], found.lines[2]]).toEqual([1, 1]);
            expect(found.over, `at ${width}px`).toBeLessThanOrEqual(0);
        }
    });
