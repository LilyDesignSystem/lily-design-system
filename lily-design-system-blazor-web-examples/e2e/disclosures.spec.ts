import { test, expect } from "@playwright/test";

// Components that open, close or dismiss, on /demos/disclosures: C# state with a native element or popover behind it.
//
// What IS asserted, with real input: each state reaching C#, native <details> keys, popovers in the top layer under
// their anchors, a modal timeout dialog.
// What is NOT asserted: screen-reader output, styling.

test.beforeEach(async ({ page }) => {
    await page.goto("/demos/disclosures");
    const button = page.getByTestId("expander").getByRole("button");
    await expect(async () => {
        await button.click();
        await expect(page.getByTestId("expander-state")).toHaveText("Expanded: True", { timeout: 500 });
    }).toPass({ timeout: 30_000 });
});

test("expander: the region comes and goes, by key too", async ({ page }) => {
    const expander = page.getByTestId("expander");
    await expect(expander.getByRole("region", { name: "More" })).toHaveText("Expanded body");
    await expander.getByRole("button").focus();
    await page.keyboard.press("Enter");
    await expect(expander.getByRole("region")).toHaveCount(0);
    await expect(page.getByTestId("expander-state")).toHaveText("Expanded: False");
    await page.keyboard.press("Space");
    await expect(expander.getByRole("button")).toHaveAttribute("aria-expanded", "true");
});

test("collapsible: the native keys reach C#", async ({ page }) => {
    await page.getByTestId("collapsible").locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("collapsible-state")).toHaveText("Collapsible: True");
    await page.keyboard.press("Space");
    await expect(page.getByTestId("collapsible-state")).toHaveText("Collapsible: False");
});

test("accordion list item: an li with a details that reaches C#", async ({ page }) => {
    const item = page.getByTestId("item");
    await expect(item.evaluate((node) => node.tagName)).resolves.toBe("LI");
    await item.locator("summary").click();
    await expect(page.getByTestId("item-state")).toHaveText("Item: True");
    await expect(item.getByText("Answer")).toBeVisible();
});

test("banners: dismissing removes them and reports", async ({ page }) => {
    await page.getByRole("button", { name: "Dismiss notice" }).click();
    await expect(page.getByTestId("banner")).toHaveCount(0);
    await page.getByRole("button", { name: "Dismiss allergy" }).click();
    await expect(page.getByTestId("medical")).toHaveCount(0);
    await expect(page.getByTestId("banner-state")).toHaveText("Closed: 2");
});

test("government banner: the toggle opens the panel", async ({ page }) => {
    const banner = page.getByTestId("government");
    await expect(banner.getByText("Official sites use")).toBeHidden();
    await banner.getByRole("button", { name: "How you know" }).click();
    await expect(banner.getByText("Official sites use")).toBeVisible();
    await expect(page.getByTestId("government-state")).toHaveText("Official: True");
});

test("sticky promo banner: fixed to the viewport, and it dismisses", async ({ page }) => {
    const promo = page.getByTestId("promo");
    await expect(promo).toBeInViewport();
    await promo.getByRole("button", { name: "Dismiss offer" }).click();
    await expect(promo).toBeHidden();
});

test("coachmark: Open shows it under its anchor, and it dismisses", async ({ page }) => {
    const mark = page.getByTestId("coachmark");
    await expect(mark).toBeHidden();
    await page.getByTestId("coachmark-open").click();
    await expect(mark).toBeVisible();
    expect(await mark.evaluate((node) => node.matches(":popover-open"))).toBe(true);
    await expect(mark).toBeInViewport({ ratio: 1 });
    await mark.getByRole("button", { name: "Close tip" }).click();
    await expect(mark).toBeHidden();
});

test("floating panel: shown from its state, in the top layer", async ({ page }) => {
    const panel = page.getByTestId("panel");
    const toggle = page.getByTestId("panel-toggle");
    await expect(panel).toBeHidden();
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveRole("region");
    await expect(panel).toHaveAccessibleName("Filters");
    expect(await panel.evaluate((el) => el.matches(":popover-open"))).toBe(true);
    await page.keyboard.press("Enter");
    await expect(panel).toBeHidden();
});

test("hover card: follows the pointer", async ({ page }) => {
    const card = page.getByTestId("card");
    await page.getByTestId("card-trigger").hover();
    await expect(card).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(card).toBeHidden();
});

test("tooltip: follows focus", async ({ page }) => {
    const tip = page.getByTestId("tooltip");
    await expect(tip).toBeHidden();
    await page.getByTestId("tooltip-trigger").focus();
    await expect(tip).toBeVisible();
    await expect(tip).toHaveText("Helpful text");
    await page.getByTestId("tooltip-trigger").blur();
    await expect(tip).toBeHidden();
});

test("timeout dialog: modal, and the consumer's action closes it", async ({ page }) => {
    const dialog = page.getByTestId("timeout");
    await page.getByTestId("timeout-open").click();
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((node) => node.matches(":modal"))).toBe(true);
    await dialog.getByRole("button", { name: "Stay signed in" }).click();
    await expect(dialog).toBeHidden();
});
