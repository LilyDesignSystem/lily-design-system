import { readdirSync } from "node:fs";
import { test, expect } from "@playwright/test";

// Every value in a summary list is on its own label's row, in every theme (tasks.md P49-T20). Until November 2026 the themes' grid
// had three columns and an item with no action has two cells, so each item slid into the row before it: "Total discharges" was
// shown beside the number of admissions.

const THEMES = readdirSync("static/themes")
    .filter((f) => f.endsWith(".css"))
    .map((f) => f.replace(/\.css$/, ""))
    .sort();

const item = (i: number, action: boolean) =>
    `<div class="summary-list-item"><dt>Label ${i} of the summary</dt><dd>Value ${i}</dd>${action ? `<dd><a href="#c${i}">Change<span> label ${i}</span></a></dd>` : ""}</div>`;
const LISTS: Record<string, boolean[]> = {
    "no actions": [false, false, false, false],
    "all actions": [true, true, true, true],
    mixed: [false, true, false, true, false],
};

for (const theme of THEMES)
    test(`${theme}: each value is on its own label's row`, async ({ page }) => {
        // The lists are added to a small static page, with the theme as its only stylesheet.
        await page.route("**/summary-list-pairing", (route) =>
            route.fulfill({
                contentType: "text/html",
                body: `<!doctype html><html lang="en"><head><title>Summary lists</title><link rel="stylesheet" href="/themes/${theme}.css" /></head><body><main>${Object.entries(
                    LISTS,
                )
                    .map(
                        ([name, actions]) =>
                            `<dl class="summary-list" data-name="${name}">${actions.map((a, i) => item(i, a)).join("")}</dl>`,
                    )
                    .join("")}</main></body></html>`,
            }),
        );
        await page.goto("/summary-list-pairing");
        expect(await page.evaluate(() => document.styleSheets[0].cssRules.length)).toBeGreaterThan(
            0,
        );
        for (const width of [320, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            const problems = await page.evaluate(() => {
                const out: string[] = [];
                for (const list of document.querySelectorAll<HTMLElement>(".summary-list")) {
                    let previousBottom = -Infinity;
                    for (const el of list.querySelectorAll(".summary-list-item")) {
                        const cells = [...el.children].map((c) => c.getBoundingClientRect());
                        const at = `${list.dataset.name}, ${el.children[0].textContent}`;
                        // The item is below every cell of the one before it, so no label shares a row with another's value.
                        if (Math.min(...cells.map((c) => c.top)) < previousBottom - 1)
                            out.push(`${at}: overlaps the item before it`);
                        // Its value is beside the label, or directly under it.
                        const [label, value] = cells;
                        const beside = value.left >= label.right - 1 && value.top < label.bottom;
                        const under = value.top >= label.bottom - 1 && value.left <= label.left + 1;
                        if (!beside && !under)
                            out.push(`${at}: value is neither beside nor under it`);
                        previousBottom = Math.max(...cells.map((c) => c.bottom));
                    }
                }
                return out;
            });
            expect(problems, `at ${width}px`).toEqual([]);
        }
    });
