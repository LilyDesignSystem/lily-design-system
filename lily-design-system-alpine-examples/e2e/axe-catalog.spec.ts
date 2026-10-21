import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

/** The theme stylesheet arrives after first paint and its colour transitions would otherwise be measured half-way. */
async function settled(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => undefined))));
}

// Every component page, axe-clean at WCAG 2.2 AA. A component page is the demo plus code listings, so a violation is
// either the snippet's or the demo fill's.
const slugs = readFileSync("../components.tsv", "utf8").split("\n").filter(Boolean).map((l) => l.split("\t")[0]);

// Known findings in the reference theme, not in the snippets: the filled-star colour (--color-warning, gold) on the
// NHS England page background is 1.49:1. Listed here so the sweep stays exact about everything else.
const THEME_FINDINGS: Record<string, string[]> = { "five-star-rating-view": ["color-contrast"] };

for (const slug of slugs) {
  test(`/components/${slug}/ is axe-clean`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`/components/${slug}/`);
    await settled(page);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).disableRules(THEME_FINDINGS[slug] ?? []).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
