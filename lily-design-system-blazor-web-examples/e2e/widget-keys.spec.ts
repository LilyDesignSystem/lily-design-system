import { test, expect, type Locator, type Page } from "@playwright/test";

// The JS and C# halves of the components on KeyedComponentBase, together, on /demos/widget-keys. bUnit runs no JS and
// tests/js no C#.
//
// What IS asserted, with real keys: one tab stop and the arrows in the toolbars; a segment checked by arrow; each
// value, open state and selection reaching its C# parameter or callback.
// What is NOT asserted: pointer dragging (the consumer's), filtering (the consumer's), styling.

test.beforeEach(async ({ page }) => {
    await page.goto("/demos/widget-keys");
    // Interactive once the circuit is up and the module has attached: a key then moves the splitter. Hydrating replaces
    // the prerendered DOM, so focus has to be set again on each try.
    const splitter = page.getByTestId("splitter");
    await expect(async () => {
        await splitter.focus();
        await page.keyboard.press("ArrowRight");
        await expect(page.getByTestId("splitter-state")).toHaveText("Splitter: 51", {
            timeout: 500,
        });
    }).toPass({ timeout: 30_000 });
});

async function expectOneTabStop(page: Page, group: Locator): Promise<void> {
    const stops = await group
        .locator("button")
        .evaluateAll((buttons) => buttons.filter((b) => (b as HTMLElement).tabIndex === 0).length);
    expect(stops).toBe(1);
}

test("the action bar roves, and Escape clears the selection in C#", async ({ page }) => {
    const bar = page.getByTestId("action-bar");
    await expectOneTabStop(page, bar);
    await bar.getByRole("button", { name: "Archive" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(bar.getByRole("button", { name: "Delete" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("action-bar-state")).toHaveText("Cleared: 1");
});

test("the action group and task bar rove", async ({ page }) => {
    const group = page.getByTestId("action-group");
    await expectOneTabStop(page, group);
    await group.getByRole("button", { name: "Bold" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(group.getByRole("button", { name: "Italic" })).toBeFocused();
    const bar = page.getByTestId("task-bar");
    await expectOneTabStop(page, bar);
    await bar.getByRole("button", { name: "Mail" }).focus();
    await page.keyboard.press("End");
    await expect(bar.getByRole("button", { name: "Files" })).toBeFocused();
});

test("an arrow moves and checks a segment", async ({ page }) => {
    const group = page.getByTestId("segment-group");
    await group.getByRole("radio", { name: "Day" }).focus();
    await page.keyboard.press("ArrowRight");
    const week = group.getByRole("radio", { name: "Week" });
    await expect(week).toBeFocused();
    await expect(week).toHaveAttribute("aria-checked", "true");
    await expect(group.getByRole("radio", { name: "Day" })).toHaveAttribute(
        "aria-checked",
        "false",
    );
});

test("the splitter's keys reach @bind-Value", async ({ page }) => {
    const state = page.getByTestId("splitter-state");
    await page.keyboard.press("Shift+ArrowLeft");
    await expect(state).toHaveText("Splitter: 41");
    await page.keyboard.press("End");
    await expect(state).toHaveText("Splitter: 100");
    await expect(page.getByTestId("splitter")).toHaveAttribute("aria-valuenow", "100");
});

test("the split view's divider reaches @bind-SplitPercent", async ({ page }) => {
    await page.getByTestId("split-view").getByRole("separator").focus();
    await page.keyboard.press("Home");
    await expect(page.getByTestId("split-view-state")).toHaveText("Split view: 0");
});

test("the cascader's keys reach @bind-Expanded and OnSelect", async ({ page }) => {
    const root = page.getByTestId("cascader");
    const state = page.getByTestId("cascader-state");
    await root.locator(".cascader-trigger").focus();
    await page.keyboard.press("ArrowDown");
    await expect(state).toContainText("open: yes");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(state).toHaveText("Place: europe/france; open: no");
    await expect(root.locator(".cascader-trigger")).toBeFocused();
    await expect(root.locator(".cascader-trigger")).toHaveText("europe/france");
});

test("Escape closes the tree select, and a click chooses", async ({ page }) => {
    const root = page.getByTestId("tree-select");
    const state = page.getByTestId("tree-select-state");
    await root.locator(".tree-select-trigger").focus();
    await page.keyboard.press("ArrowDown");
    await expect(state).toContainText("open: yes");
    await page.keyboard.press("Escape");
    await expect(state).toHaveText("Folder: ; open: no");
    await root.locator(".tree-select-trigger").click();
    await expect(state).toContainText("open: yes");
    await root.getByRole("treeitem", { name: "Pictures" }).click();
    await expect(state).toHaveText("Folder: pics; open: no");
});

test("typing the trigger opens the mentions, and Enter writes the mention to @bind-Value", async ({
    page,
}) => {
    const input = page.getByRole("combobox", { name: "Comment" });
    const state = page.getByTestId("mentions-state");
    await input.focus();
    await page.keyboard.type("Hi @gr");
    await expect(state).toContainText("open: yes");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(state).toContainText("Mentioned: grace");
    await expect(state).toContainText("open: no");
    await expect(input).toHaveValue(/@grace/);
    await expect(state).toContainText("comment: Hi @grace");
});

test("the cropper's keys reach OnCropChange", async ({ page }) => {
    await page.getByTestId("cropper").focus();
    await page.keyboard.press("Alt+ArrowLeft");
    await expect(page.getByTestId("cropper-state")).toHaveText("Crop: 0 0 99 100");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("cropper-state")).toHaveText("Crop: 1 0 99 100");
});

test("@bind-Value and @bind-Checked work in the browser, with no character lost", async ({
    page,
}) => {
    const state = page.getByTestId("bound-state");
    await page.getByTestId("bound-text").focus();
    await page.keyboard.type("Ada Lovelace, 1815");
    await expect(state).toContainText("Name: Ada Lovelace, 1815;");
    await expect(page.getByTestId("bound-text")).toHaveValue("Ada Lovelace, 1815");
    await page.getByTestId("bound-id").pressSequentially("QQ 12 34 56 C");
    await expect(page.getByTestId("bound-id-state")).toHaveText("Number: QQ 12 34 56 C");
    await page.getByTestId("bound-number").fill("4.5");
    await page.getByTestId("bound-number").blur();
    await expect(state).toContainText("count: 4.5;");
    await page.getByTestId("bound-date").fill("2026-11-05");
    await expect(state).toContainText("day: 2026-11-05;");
    await page.getByTestId("bound-area").pressSequentially("two words");
    await expect(state).toContainText("notes: two words;");
    await page.getByTestId("bound-check").check();
    await expect(state).toContainText("agree: yes");
});

test("a range keeps a value above 100 when its max is higher", async ({ page }) => {
    await expect(page.getByTestId("bound-range")).toHaveValue("150");
    await page.getByTestId("bound-range").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("bound-state")).toContainText("volume: 151;");
});
