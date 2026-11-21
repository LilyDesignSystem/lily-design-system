import { test, expect } from "@playwright/test";

// The themes' header cells break only between words (2026-11-21). overflow-wrap: anywhere also lowered a cell's
// min-content width to one letter, so a table that sizes its own columns split one-word headers ("Patie/nt"). Header
// cells now use break-word, which keeps each column at least as wide as its header's longest word; data cells keep
// anywhere, so a long value still wraps at a narrow width (WCAG 1.4.10).
const THEMES = ["light", "dark", "united-kingdom-national-health-service-england-for-patients"];

for (const theme of THEMES) {
    test(`${theme}: one-word headers stay on one line in a table that sizes its own columns`, async ({
        page,
    }) => {
        await page.goto("/index.html");
        await page.setContent(`<!doctype html><html lang="en"><head>
            <link rel="stylesheet" href="/themes/${theme}.css" /></head>
            <body><div style="inline-size: 320px">
            <table class="table"><thead><tr>
              <th scope="col">Patient</th><th scope="col">Medication</th><th scope="col">Instructions</th>
            </tr></thead><tbody><tr>
              <td>Jones</td><td>Amoxicillin</td>
              <td>Take one capsule three times a day with water, for seven days, even if you feel better sooner.</td>
            </tr></tbody></table></div></body></html>`);
        await page.waitForFunction(
            () => document.styleSheets.length > 0 && document.styleSheets[0].cssRules.length > 0,
        );
        const lines = await page.evaluate(() =>
            Array.from(document.querySelectorAll("th")).map((cell) => {
                const range = document.createRange();
                range.selectNodeContents(cell);
                const tops = new Set(
                    Array.from(range.getClientRects()).map((r) => Math.round(r.top)),
                );
                return [cell.textContent, tops.size];
            }),
        );
        for (const [text, count] of lines)
            expect(count, `${text} wraps onto ${count} lines`).toBe(1);
    });
}

test("a value too long for its cell still wraps rather than widening the page", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/index.html");
    await page.setContent(`<!doctype html><html lang="en"><head>
        <link rel="stylesheet" href="/themes/light.css" /></head>
        <body><table class="table" style="table-layout: fixed; inline-size: 100%"><tbody><tr>
          <td>NHS number</td><td>https://example.org/a-very-long-unbroken-address-that-is-wider-than-a-phone-screen</td>
        </tr></tbody></table></body></html>`);
    await page.waitForFunction(
        () => document.styleSheets.length > 0 && document.styleSheets[0].cssRules.length > 0,
    );
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
});
