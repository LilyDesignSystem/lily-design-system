import { expect, test } from "@playwright/test";

test("data grid: sorts, filters, selects and pages with the mouse and keyboard", async ({ page }) => {
  await page.goto("/helpers/data-grid/");
  const rows = page.locator("#demo tbody tr");
  await expect(rows).toHaveCount(5);
  await page.getByRole("button", { name: "Sort by Years" }).click();
  await expect(page.getByRole("columnheader", { name: /Years/ })).toHaveAttribute("aria-sort", "ascending");
  await expect(rows.first()).toContainText("Hugo Rossi");
  await page.getByLabel("Search people").fill("care");
  await expect(rows).toHaveCount(3);
  await page.getByLabel("Search people").fill("");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.locator(".data-grid-pager-status")).toHaveText("Page 2 of 2");
  await page.getByLabel("Select Grace Kim").check();
  await expect(page.locator("tbody tr[aria-selected=true]")).toHaveCount(1);
  // keyboard: the header cell is the one tab stop; arrows move through cells
  await page.locator('[data-row="-1"][data-col="0"]').focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator('[data-row="0"][data-col="1"]')).toBeFocused();
});

test("kanban board: Alt+Arrow moves a card and the Doing limit warns", async ({ page }) => {
  await page.goto("/helpers/kanban-board/");
  await page.locator('[data-row="0"][data-col="0"]').focus();
  await page.keyboard.press("Alt+ArrowRight");
  await expect(page.locator('[data-col="1"] .kanban-card-title')).toHaveText(["Build the component", "Review the markup", "Write the spec"]);
  await expect(page.locator("#demo .kanban-board-status")).toHaveText("Write the spec moved to Doing");
  await expect(page.locator(".kanban-board-limit").nth(1)).toHaveText("3 cards, limit 2");
});

test("kanban board: the Move menu is operable with the keyboard alone", async ({ page }) => {
  await page.goto("/helpers/kanban-board/");
  const cell = page.locator('[data-row="1"][data-col="0"]');
  await cell.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox", { name: "Move to" })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-col="2"] .kanban-card-title')).toHaveText(["Choose the name", "Draft the tests"]);
});

test("calendar: next month, a picked day and an event", async ({ page }) => {
  await page.goto("/helpers/calendar/");
  const title = page.locator(".calendar-view-title");
  const first = await title.textContent();
  await page.getByRole("button", { name: "Next month" }).click();
  await expect(title).not.toHaveText(first ?? "");
  await page.getByRole("button", { name: "Today" }).click();
  await expect(title).toHaveText(first ?? "");
  const today = page.locator("td[aria-current=date]");
  await today.click();
  await expect(today).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Week" }).click();
  await expect(page.locator("td[data-date]")).toHaveCount(7);
});

test("Gantt chart: collapse hides the children, and the critical path is marked", async ({ page }) => {
  await page.goto("/helpers/gantt-chart/");
  await expect(page.locator(".gantt-chart-task-label")).toHaveText(["Phase one", "Design", "Build", "Write docs", "Launch"]);
  await page.getByRole("button", { name: "Collapse Phase one" }).click();
  await expect(page.locator(".gantt-chart-task-label")).toHaveText(["Phase one", "Write docs", "Launch"]);
  await page.getByRole("button", { name: "Expand Phase one" }).click();
  await expect(page.locator("tr[data-critical]").first()).toBeVisible();
});
