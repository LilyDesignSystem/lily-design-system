// Every component page through axe: WCAG 2.2 A and AA rules, in <main> (tasks.md P25-T10).
//
// axe-sweep.allow.json holds known failures as "slug rule" with a reason. A new failure fails, and so does a listed one that
// is fixed, so the list can only shrink. Contrast has its own test in the default and dark themes, with transitions off, because
// a colour caught mid-transition is a false failure (P25-T9). Closed popups hide most of their ARIA from axe, which this does
// not yet open.
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

for (const theme of ["default", "dark"]) {
    test(`no component page fails colour contrast in the ${theme} theme`, async ({ page }) => {
        test.setTimeout(600_000);
        const found: string[] = [];
        for (const slug of slugs) {
            await page.goto(`/components/${slug}/`);
            await page.addStyleTag({
                content:
                    "*, *::before, *::after { transition: none !important; animation: none !important; }",
            });
            if (theme === "dark") {
                await page.evaluate(
                    () =>
                        new Promise<void>((done) => {
                            const link = document.querySelector<HTMLLinkElement>(
                                'link[data-lily-theme-picker="theme"]',
                            )!;
                            document.documentElement.setAttribute("data-theme", "dark");
                            link.onload = () => done();
                            link.href = "/themes/dark.css";
                        }),
                );
            }
            const { violations } = await new AxeBuilder({ page })
                .include("main")
                .withRules(["color-contrast"])
                .analyze();
            if (violations.length) found.push(`${slug} ${theme} contrast`);
        }
        expect(
            found.filter((key) => !allow[key]),
            "new contrast failures",
        ).toEqual([]);
    });
}
