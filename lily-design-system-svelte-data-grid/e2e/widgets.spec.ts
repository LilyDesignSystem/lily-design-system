import { test, expect } from "@playwright/test";

// §8.25, §8.26 and §8.34 in a real browser: focus and tab order for widgets inside cells.

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".w-input")).toHaveCount(2);
});

const emailCell = (page: import("@playwright/test").Page, row: number) =>
  page.locator(".data-table-body tr").nth(row).locator(".data-table-td").nth(1);

test("§8.26 widgets in body cells are not tab stops; Tab leaves the grid in one step per stop", async ({ page, browserName }) => {
  for (const w of await page.locator(".w-link, .w-input").all()) await expect(w).toHaveAttribute("tabindex", "-1");
  await page.locator("#before").focus();
  // Tab walks through the grid's own stops only (the roving cell, sort button …), never a body widget, and reaches #after.
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const onWidget = await page.evaluate(() => !!document.activeElement?.matches(".w-link, .w-input"));
    expect(onWidget).toBe(false);
    if ((await page.evaluate(() => document.activeElement?.id)) === "after") return;
  }
  // WebKit on macOS skips buttons when Tab is pressed (a Safari setting), so it cannot be required to reach #after.
  expect(browserName, "Tab never reached the element after the grid").toBe("webkit");
});

test("§8.26 Enter on a cell enters it; Tab moves between its widgets; leaving restores tabindex -1", async ({ page }) => {
  const cell = emailCell(page, 0);
  await cell.focus();
  await page.keyboard.press("Enter");
  await expect(cell.locator(".w-link")).toBeFocused();
  await expect(cell.locator(".w-link")).toHaveAttribute("tabindex", "0");
  await expect(cell.locator(".w-input")).toHaveAttribute("tabindex", "0");
  await page.keyboard.press("Tab");
  await expect(cell.locator(".w-input")).toBeFocused();
  // Tab out of the cell: the widgets go back to -1.
  await page.keyboard.press("Tab");
  await expect(cell.locator(".w-input")).toHaveAttribute("tabindex", "-1");
  await expect(cell.locator(".w-link")).toHaveAttribute("tabindex", "-1");
});

test("§8.25 arrow keys and typing in an input stay in the input; Escape returns focus to the cell", async ({ page }) => {
  const cell = emailCell(page, 0);
  const input = cell.locator(".w-input");
  await input.focus();
  await page.keyboard.press("End");
  await page.keyboard.type("x");
  await page.keyboard.press("ArrowLeft");
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("bob@example.comx");
  await page.keyboard.press("Escape");
  await expect(cell).toBeFocused();
});

test("§8.34 a click on a widget does not activate the row; a click elsewhere in a cell does", async ({ page }) => {
  await emailCell(page, 0).locator(".w-input").click();
  await expect(page.locator("#activated")).toHaveText("");
  await page.locator(".data-table-body tr").nth(1).locator(".data-table-td").first().click();
  await expect(page.locator("#activated")).toHaveText("Alice");
});

test("a click on a widget moves the roving position to its cell", async ({ page }) => {
  const cell = emailCell(page, 1);
  await cell.locator(".w-input").click();
  await expect(cell).toHaveAttribute("tabindex", "0");
  await expect(cell.locator(".w-input")).toHaveAttribute("tabindex", "0");
});
