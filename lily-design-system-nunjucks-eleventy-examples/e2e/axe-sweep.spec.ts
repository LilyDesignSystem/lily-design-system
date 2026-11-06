// Every component page through axe: WCAG 2.2 A and AA rules, in <main> (tasks.md P25-T10).
//
// axe-sweep.allow.json holds known failures as "slug rule" with a reason. A new failure fails, and so does a listed one that
// is fixed, so the list can only shrink. Colour contrast is left out until P25-T9 settles it: it depends on the theme and on
// transitions, so it would make this flaky. Closed popups hide most of their ARIA from axe, which this does not yet open.
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const allow: Record<string, string> = JSON.parse(
    fs.readFileSync(path.join(import.meta.dirname, "axe-sweep.allow.json"), "utf-8"),
);
const slugs = fs
    .readFileSync(path.join(import.meta.dirname, "../../components.tsv"), "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("\t")[0]);

test("no component page fails a WCAG A or AA rule", async ({ page }) => {
    test.setTimeout(600_000);
    const found: string[] = [];
    for (const slug of slugs) {
        await page.goto(`/components/${slug}/`);
        const { violations } = await new AxeBuilder({ page })
            .include("main")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .disableRules(["color-contrast"])
            .analyze();
        for (const violation of violations) found.push(`${slug} ${violation.id}`);
    }
    expect(
        found.filter((key) => !allow[key]),
        "new axe failures",
    ).toEqual([]);
    expect(
        Object.keys(allow).filter((key) => !found.includes(key)),
        "fixed: remove from axe-sweep.allow.json",
    ).toEqual([]);
});
