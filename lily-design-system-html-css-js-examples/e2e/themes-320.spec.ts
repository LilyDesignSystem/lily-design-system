import { readdirSync } from "node:fs";
import { test, expect } from "@playwright/test";

// A 320px page in every theme (tasks.md P42-T5, WCAG 1.4.10 reflow). Themes 0.7.0 made table header cells keep whole words, so a
// table raises its column's minimum width: a page whose layout is one `1fr` grid column holding a table grew 47px past a 320px
// screen. The page below is the content a clinical page holds (a record list, a table in its labelled scroller, a disclosure and
// long unbroken values) in a `minmax(0, 1fr)` column, which is how a page lays itself out so that none of it can widen the page. It
// must not scroll sideways in any of the 63 themes. The themes wrap a long value where one lands (a table cell, a link, code, an
// identifier view), never on every paragraph, so each long value below is in one of those.
const THEMES = readdirSync("../themes")
    .filter((f) => f.endsWith(".css"))
    .map((f) => f.replace(/\.css$/, ""))
    .sort();

const WORD = "Pneumonoultramicroscopicsilicovolcanoconiosis".repeat(2);

const page320 = (
    theme: string,
    column: string,
    scroller: boolean,
) => `<!doctype html><html lang="en"><head>
  <link rel="stylesheet" href="/themes/${theme}.css" /></head>
  <body style="margin: 0"><main style="display: grid; grid-template-columns: ${column}; padding: 0 1rem">
  <section>
    <h1>Summary</h1>
    <ul class="record-list" aria-label="Allergies"><li class="record-list-item">Penicillin: rash. <a href="#reference">${WORD}</a></li></ul>
    ${scroller ? '<div class="horizontal-scroller" role="region" aria-label="Results" tabindex="0">' : ""}
    <table class="table"><thead><tr>
      <th scope="col">Patient</th><th scope="col">Medication</th><th scope="col">Instructions</th><th scope="col">Prescriber</th>
    </tr></thead><tbody><tr><td>Jones</td><td>Amoxicillin</td><td>${WORD}</td><td>Dr Okoro</td></tr></tbody></table>
    ${scroller ? "</div>" : ""}
    <details class="details"><summary>Narrative</summary><p><code>${WORD}</code></p></details>
    <p><a href="#address">${WORD}</a></p>
  </section></main></body></html>`;

async function sideways(page: import("@playwright/test").Page, html: string): Promise<number> {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/index.html");
    await page.setContent(html);
    await page.waitForFunction(
        () => document.styleSheets.length > 0 && document.styleSheets[0].cssRules.length > 0,
    );
    return page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
}

test("there are 63 themes to test", () => {
    expect(THEMES).toHaveLength(63);
});

for (const theme of THEMES) {
    test(`${theme}: a record list, a table in its scroller, a disclosure and a long word do not widen a 320px page`, async ({
        page,
    }) => {
        expect(await sideways(page, page320(theme, "minmax(0, 1fr)", true))).toBeLessThanOrEqual(0);
    });
}

// The hazard the themes 0.7.0 changelog warns about, kept as a test so it is a documented contract and not a surprise. A table whose
// whole-word headers are wider than the screen widens the page unless BOTH the column can shrink (`minmax(0, 1fr)`, since a bare
// `1fr` track will not go below its content) AND the table is in a labelled `horizontal-scroller`. Measured on 4 headers at 320px.
// The fix is on the page's side, never in a theme: a theme cannot make a `1fr` track shrink, and `display: block` on a table
// would strip its semantics.
const grid = (column: string, scroller: boolean) => page320("light", column, scroller);

for (const [column, scroller, fits] of [
    ["1fr", false, false],
    ["1fr", true, false],
    ["minmax(0, 1fr)", false, false],
    ["minmax(0, 1fr)", true, true],
] as const) {
    test(`a wide-header table in a ${column} column ${scroller ? "inside" : "without"} a scroller ${fits ? "fits" : "widens"} a 320px page`, async ({
        page,
    }) => {
        const overflow = await sideways(page, grid(column, scroller));
        if (fits) expect(overflow).toBeLessThanOrEqual(0);
        else expect(overflow).toBeGreaterThan(0);
    });
}
