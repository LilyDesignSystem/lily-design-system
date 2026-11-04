import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

// The page-level development check (spec/testing#development-warnings) over every page this app serves.
const SOURCE = readFileSync(join(__dirname, "../../shared/page-check.js"), "utf8")
    .replace(/^export /gm, "")
    .concat("\nwindow.lilyFindUnnamed = findUnnamed;");

const COMPOSED = [
    "/",
    "/book-an-appointment.html",
    "/contact-form.html",
    "/dashboard.html",
    "/dialog-flow.html",
    "/file-upload-form.html",
    "/logo-slot.html",
    "/navigation-and-menus.html",
    "/page-layout.html",
    "/rating-and-feedback.html",
    "/rtl-demo.html",
    "/search-and-filter.html",
    "/settings-page.html",
    "/tabbed-interface.html",
    "/task-management.html",
    "/timeline-and-cards.html",
    "/components/index.html",
];

const slugs = readFileSync(join(__dirname, "../../components.tsv"), "utf8")
    .trim()
    .split("\n")
    .map((line) => line.split("\t")[0]);

async function unnamedOn(page: Page, path: string): Promise<string[]> {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.addScriptTag({ content: SOURCE });
    return page.evaluate(() =>
        (window as unknown as { lilyFindUnnamed: () => Element[] })
            .lilyFindUnnamed()
            .map((el) => (el.cloneNode(false) as Element).outerHTML),
    );
}

test("every composed page names its controls", async ({ page }) => {
    const found: Record<string, string[]> = {};
    for (const path of COMPOSED) {
        const unnamed = await unnamedOn(page, path);
        if (unnamed.length) found[path] = unnamed;
    }
    expect(found).toEqual({});
});

test("every component page names its controls", async ({ page }) => {
    test.setTimeout(600_000);
    const found: Record<string, string[]> = {};
    for (const slug of slugs) {
        const unnamed = await unnamedOn(page, `/components/component.html?slug=${slug}`);
        if (unnamed.length) found[slug] = unnamed;
    }
    expect(found).toEqual({});
});
