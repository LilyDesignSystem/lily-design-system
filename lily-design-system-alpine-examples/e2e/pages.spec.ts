import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** The theme stylesheet arrives after first paint and its colour transitions would otherwise be measured half-way. */
async function settled(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => undefined))));
}

const PAGES = ["/", "/components/", "/helpers/", "/helpers/data-grid/", "/helpers/kanban-board/", "/helpers/calendar/", "/helpers/gantt-chart/"];

for (const path of PAGES) {
  test(`${path} has no axe violations and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(path);
    await settled(page);
    await expect(page.locator("h1")).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("the components index filters as you type", async ({ page }) => {
  await page.goto("/components/");
  const status = page.getByRole("status");
  await expect(status).toContainText("571 of 571");
  await page.getByLabel("Search components").fill("kanban");
  await expect(status).toContainText(/\d+ of 571/);
  await expect(status).not.toContainText("571 of 571");
  await expect(page.getByRole("link", { name: "KanbanTable", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Accordion", exact: true })).toBeHidden();
});

test("the theme switcher changes the stylesheet and is remembered", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Theme").selectOption("abyss");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "abyss");
  await expect(page.locator("#lily-theme-link")).toHaveAttribute("href", "/themes/abyss.css");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "abyss");
});

test("a component page runs its demo: a switch toggles", async ({ page }) => {
  await page.goto("/components/switch-button/");
  const demo = page.locator("#demo [role=switch]");
  await expect(demo).toHaveAttribute("aria-checked", "false");
  await demo.click();
  await expect(demo).toHaveAttribute("aria-checked", "true");
});
