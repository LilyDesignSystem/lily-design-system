import { test, expect } from "@playwright/test";

// The controls that need the browser and C# together, on /demos/controls. bUnit runs no JS and tests/js no C#.
//
// What IS asserted, with real input: each value reaching its C# parameter, a form staying on the page, Enter adding a
// tag rather than submitting, the native key on a switch, a popover in the top layer, real scrolling, the scrollspy.
// What is NOT asserted: the time input's own segments, the native select popup, styling.

test.beforeEach(async ({ page }) => {
    await page.goto("/demos/controls");
    // Interactive once the circuit is up: hydrating replaces the prerendered DOM, so the click may have to be repeated.
    await expect(async () => {
        await page.getByTestId("toggle").click();
        await expect(page.getByTestId("toggle-state")).toHaveText("Pressed: True", { timeout: 500 });
    }).toPass({ timeout: 30_000 });
    await page.getByTestId("toggle").click();
    await expect(page.getByTestId("toggle-state")).toHaveText("Pressed: False");
});

test("toggle button: Space and Enter toggle once each", async ({ page }) => {
    const toggle = page.getByTestId("toggle");
    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("toggle-state")).toHaveText("Pressed: True");
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
});

test("slider: keeps a value above the default max, and arrows reach C#", async ({ page }) => {
    const slider = page.getByTestId("slider");
    await expect(slider).toHaveValue("150");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("slider-state")).toHaveText("Volume: 151");
    await page.keyboard.press("End");
    await expect(page.getByTestId("slider-state")).toHaveText("Volume: 200");
});

test("time picker input: binds a string", async ({ page }) => {
    const time = page.getByTestId("time");
    await expect(time).toHaveAttribute("type", "time");
    await expect(time).toHaveValue("09:30");
    await time.fill("10:15");
    await expect(page.getByTestId("time-state")).toHaveText("Time: 10:15");
});

test("the time inputs report no seconds Blazor added", async ({ page }) => {
    await page.getByTestId("time-input").fill("10:00");
    await expect(page.getByTestId("time-input-state")).toHaveText("Time input: 10:00");
    await page.getByTestId("datetime").fill("2026-11-05T10:15");
    await expect(page.getByTestId("datetime-state")).toHaveText("Date and time: 2026-11-05T10:15");
});

test("select: binds, and an unbound one keeps the option marked selected", async ({ page }) => {
    await page.getByTestId("select").selectOption("blue");
    await expect(page.getByTestId("select-state")).toHaveText("Colour: blue");
    await expect(page.getByTestId("select-unbound")).toHaveValue("m");
});

test("theme select: starts on its value and binds", async ({ page }) => {
    await expect(page.getByTestId("theme")).toHaveValue("dark");
    await page.getByTestId("theme").selectOption("light");
    await expect(page.getByTestId("theme-state")).toHaveText("Theme: light");
});

test("details: the summary reaches C#, and C# opens it without a flip back", async ({ page }) => {
    const details = page.getByTestId("details");
    await details.locator("summary").click();
    await expect(page.getByTestId("details-state")).toHaveText("Open: True");
    await details.locator("summary").click();
    await expect(page.getByTestId("details-state")).toHaveText("Open: False");
    await page.getByTestId("details-from-csharp").click();
    await expect(details).toHaveAttribute("open", "");
    await expect(page.getByTestId("details-state")).toHaveText("Open: True");
    await expect(details).toHaveAttribute("open", "");
});

test("tag input: Enter adds and clears without submitting; an empty Enter submits", async ({ page }) => {
    const field = page.getByTestId("tags").locator("input");
    await field.focus();
    await page.keyboard.type("  one ");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("tags-state")).toHaveText("Tags: one");
    await expect(field).toHaveValue("");
    await expect(page.getByTestId("tags").locator(".tag")).toHaveText("one");
    await expect(page.getByTestId("form-state")).toHaveText("Submits: 0, resets: 0");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("form-state")).toHaveText("Submits: 1, resets: 0");
    await expect(page).toHaveURL(/\/demos\/controls$/);
});

test("form: reset reports; data filter form: submit stays on the page", async ({ page }) => {
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByTestId("form-state")).toHaveText("Submits: 0, resets: 1");
    await page.getByRole("button", { name: "Filter", exact: true }).click();
    await expect(page.getByTestId("filter-state")).toHaveText("Filters: 1");
    await expect(page).toHaveURL(/\/demos\/controls$/);
});

test("newsletter: the address reaches C#, and success shows the message", async ({ page }) => {
    const form = page.getByTestId("newsletter");
    await expect(form.getByRole("status")).toBeHidden();
    await form.getByRole("textbox", { name: "Email" }).fill("a@example.org");
    await expect(page.getByTestId("newsletter-state")).toHaveText("Email: a@example.org");
    await form.getByRole("button", { name: "Join" }).click();
    await expect(form).toHaveAttribute("data-state", "success");
    await expect(form.getByRole("status")).toHaveText("Thank you");
});

test("popconfirm: Open shows it, and the buttons reach C#", async ({ page }) => {
    const dialog = page.getByTestId("popconfirm");
    await expect(dialog).toBeHidden();
    await page.getByTestId("popconfirm-open").click();
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((node) => node.matches(":popover-open"))).toBe(true);
    await dialog.getByRole("button", { name: "Yes" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("popconfirm-state")).toHaveText("Confirmed: 1");
    await page.getByTestId("popconfirm-open").click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "No" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("popconfirm-state")).toHaveText("Confirmed: 1");
});

test("horizontal scroller: the keys scroll it", async ({ page }) => {
    const scroller = page.getByTestId("scroller");
    const left = () => scroller.evaluate((node) => node.scrollLeft);
    await scroller.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(left).toBe(40);
    await page.keyboard.press("ArrowLeft");
    await expect.poll(left).toBe(0);
    await page.keyboard.press("End");
    await expect.poll(left).toBeGreaterThan(40);
    await page.keyboard.press("Home");
    await expect.poll(left).toBe(0);
});

test("contents nav: the section in view reaches C#", async ({ page }) => {
    await expect(page.getByTestId("contents-state")).toHaveText("Active: first");
    await page.evaluate(() => document.getElementById("second")!.scrollIntoView());
    await expect(page.getByTestId("contents-state")).toHaveText("Active: second");
    await expect(page.getByTestId("contents").getByRole("link", { name: "Second" })).toHaveAttribute("aria-current", "true");
});
