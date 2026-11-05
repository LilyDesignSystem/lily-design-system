import { test, expect } from "@playwright/test";

// The JS and C# halves of Blazor's keyboard behaviour, together, on /demos/keyboard. bUnit runs no JS and tests/js no C#.
//
// What IS asserted, with real keys, in Chromium and WebKit (Firefox is in the config too):
//   - Combobox: the arrows open and move, Enter reaches @bind-Value and OnSelect, a real click does too;
//   - TreeList: ArrowRight and ArrowLeft reach @bind-Expanded on TreeListItem;
//   - Escape in a combobox inside a Dialog closes the list and leaves the dialog open; the next Escape closes it.
// What is NOT asserted: filtering (consumer), styling.

test.beforeEach(async ({ page }) => {
    await page.goto("/demos/keyboard");
    // Interactive once the circuit is up and the modules have loaded: a key then opens the list. Hydrating replaces the
    // prerendered DOM, so focus has to be set again on each try.
    await expect(async () => {
        await page.getByRole("combobox", { name: "Fruit" }).focus();
        await page.keyboard.press("Alt+ArrowDown");
        await expect(page.getByTestId("fruit-state")).toContainText("open: yes", { timeout: 500 });
    }).toPass({ timeout: 30_000 });
    await page.keyboard.press("Alt+ArrowUp");
    await expect(page.getByTestId("fruit-state")).toContainText("open: no");
});

test("the combobox's keys reach its parameters", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Fruit" });
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const active = await input.getAttribute("aria-activedescendant");
    await expect(page.locator(`[id="${active}"]`)).toHaveText("Banana");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("fruit-state")).toContainText(
        "Value: Banana; chosen: Banana; open: no",
    );
    await expect(input).toHaveValue("Banana");
});

test("a click on an option chooses it and focus stays in the input", async ({ page }) => {
    const input = page.getByRole("combobox", { name: "Fruit" });
    await page.keyboard.press("ArrowDown");
    await page.locator('[data-testid="fruit"] [role="option"]', { hasText: "Cherry" }).click();
    await expect(page.getByTestId("fruit-state")).toContainText(
        "Value: Cherry; chosen: Cherry; open: no",
    );
    await expect(input).toBeFocused();
});

test("the tree's arrows reach TreeListItem's Expanded", async ({ page }) => {
    const branch = page.locator('[data-testid="files"] > [role="treeitem"]').first();
    await branch.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("files-state")).toHaveText("Branch open: yes");
    await expect(branch).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByTestId("files-state")).toHaveText("Branch open: no");
});

test("Escape in a combobox in a dialog closes the list, not the dialog", async ({ page }) => {
    await page.getByTestId("open-dialog").click();
    const state = page.getByTestId("dialog-state");
    await expect(state).toContainText("Dialog open: yes");
    await page.getByRole("combobox", { name: "Tea" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(state).toContainText("list open: yes");
    await page.keyboard.press("Escape");
    await expect(state).toHaveText("Dialog open: yes; list open: no");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(state).toContainText("Dialog open: no");
});
