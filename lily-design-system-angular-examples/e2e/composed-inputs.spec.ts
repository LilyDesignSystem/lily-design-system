import { test, expect } from "@playwright/test";

// Inputs made of several parts, on /demos/composed-inputs, with real input.
//
// What IS asserted: each value reaching its parameter, the keys of a native radio group, Enter searching rather than
// submitting, a real file chooser, the current tour step.
// What is NOT asserted: the native date and select popups, form reset, styling.

test.beforeEach(async ({ page }) => {
    await page.goto("/demos/composed-inputs");
    // Interactive once hydrated; until then typing reaches no signal.
    const field = page.getByTestId("mask").locator("input");
    const state = page.getByTestId("mask-state");
    await expect(async () => {
        await field.fill("555");
        await expect(state).toHaveText("Phone: 555", { timeout: 1000 });
    }).toPass({ timeout: 30_000 });
});

test("text input with search: Enter searches and does not submit", async ({ page }) => {
    const search = page.getByTestId("search");
    await search.getByRole("textbox", { name: "Terms" }).fill("lily");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("search-state")).toHaveText("Searched: lily, submits: 0");
    await search.getByRole("textbox", { name: "Terms" }).fill("two");
    await search.getByRole("button", { name: "Search" }).click();
    await expect(page.getByTestId("search-state")).toHaveText("Searched: two, submits: 0");
});

test("password: types, and the toggle shows it", async ({ page }) => {
    const root = page.getByTestId("password");
    const field = root.locator("input");
    await field.fill("secret");
    await expect(page.getByTestId("password-state")).toHaveText("Password: secret");
    await expect(field).toHaveAttribute("type", "password");
    await root.getByRole("button", { name: "Show password" }).click();
    await expect(field).toHaveAttribute("type", "text");
    await expect(field).toHaveValue("secret");
});

test("text area: the count follows typing and stops at the limit", async ({ page }) => {
    const notes = page.getByTestId("notes");
    await notes.locator("textarea").focus();
    await page.keyboard.type("hello");
    await expect(notes.locator("span")).toHaveText("5 of 10");
    await page.keyboard.type(" world and more");
    await expect(notes.locator("span")).toHaveText("10 of 10");
});

test("input with mask: shows the mask", async ({ page }) => {
    await expect(page.getByTestId("mask").locator(".input-with-mask-display")).toHaveText(
        "___-____",
    );
});

test("select with extras: the extras are beside it, and it binds", async ({ page }) => {
    const root = page.getByTestId("extras");
    await expect(root.getByText("Before")).toBeVisible();
    await expect(root.getByText("After")).toBeVisible();
    await root.locator("select").selectOption("red");
    await expect(page.getByTestId("extras-state")).toHaveText("Colour: red");
});

test("date field: a group named by its legend, and the error goes when all three parts are filled", async ({
    page,
}) => {
    const group = page.getByRole("group", { name: "Birthday" });
    const day = group.getByLabel("Day");
    await expect(day).toHaveAttribute("aria-invalid", "true");
    await expect(group.getByRole("alert")).toHaveText("Enter a date");
    await day.fill("5");
    await group.getByLabel("Month").fill("11");
    await group.getByLabel("Year").fill("2026");
    await expect(page.getByTestId("date-state")).toHaveText("Date: 2026-11-05");
    await expect(group.getByRole("alert")).toHaveCount(0);
    await expect(day).not.toHaveAttribute("aria-invalid");
});

test("field: the label names the control inside", async ({ page }) => {
    const root = page.getByTestId("field");
    await expect(root.getByLabel("Town")).toBeVisible();
    await expect(root.getByRole("alert")).toHaveText("Enter a town");
});

test("file upload: the button opens the chooser, and the count is the consumer's words", async ({
    page,
}) => {
    const root = page.getByTestId("upload");
    const chooser = page.waitForEvent("filechooser");
    await root.getByRole("button", { name: "Choose files" }).click();
    await (
        await chooser
    ).setFiles([
        { name: "a.txt", mimeType: "text/plain", buffer: Buffer.from("a") },
        { name: "b.txt", mimeType: "text/plain", buffer: Buffer.from("b") },
    ]);
    await expect(root.locator("[data-file-count]")).toHaveAttribute("data-file-count", "2");
    await expect(root.locator("[data-file-count]")).toHaveText("Chosen: 2");
});

test("net promoter score: arrows move through the native radios", async ({ page }) => {
    const group = page.getByRole("radiogroup", { name: "Score" });
    // Focus first: WebKit on macOS does not focus a radio that is clicked.
    await group.getByRole("radio", { name: "3", exact: true }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByTestId("nps-state")).toHaveText("Score: 3");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("nps-state")).toHaveText("Score: 4");
    await expect(group.getByRole("radio", { name: "4", exact: true })).toBeChecked();
});

test("status pickers: nothing is chosen at first, and they bind", async ({ page }) => {
    const rag = page.getByRole("radiogroup", { name: "Status" });
    await expect(rag.getByRole("radio", { checked: true })).toHaveCount(0);
    await rag.getByRole("radio", { name: "Amber" }).check();
    await expect(page.getByTestId("rag-state")).toHaveText("Status: amber");
    const roygb = page.getByRole("radiogroup", { name: "Rating" });
    await expect(roygb.getByRole("radio", { checked: true })).toHaveCount(0);
    await roygb.getByRole("radio", { name: "Blue" }).check();
    await expect(page.getByTestId("roygb-state")).toHaveText("Rating: blue");
});

test("task list item: the label checks it", async ({ page }) => {
    const task = page.getByTestId("task");
    await task.getByText("Write").click();
    await expect(page.getByTestId("task-state")).toHaveText(/Task: true/i);
    await expect(task).toHaveAttribute("data-checked", "true");
});

test("tour list item: only the current step shows", async ({ page }) => {
    await expect(page.getByText("First step")).toBeVisible();
    await expect(page.getByText("Second step")).toBeHidden();
    await page.getByTestId("next").click();
    await expect(page.getByText("First step")).toBeHidden();
    await expect(page.getByText("Second step")).toBeVisible();
});

test("tag input div: Enter adds the trimmed text and clears the field", async ({ page }) => {
    const group = page.getByRole("group", { name: "Tags" });
    const field = group.getByRole("textbox", { name: "Tags" });
    await field.fill("  one  ");
    await field.press("Enter");
    await expect(group.locator(".tag")).toHaveText(["one"]);
    await expect(field).toHaveValue("");
    await field.press("Enter");
    await expect(group.locator(".tag")).toHaveCount(1);
});
