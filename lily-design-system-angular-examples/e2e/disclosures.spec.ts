import { test, expect } from "@playwright/test";

// Components that open, close or dismiss, on /demos/disclosures: a signal with a native element or popover behind it.
//
// What IS asserted, with real input: each state reaching the signal, native <details> keys, popovers in the top layer.
// What is NOT asserted: screen-reader output, styling.

test.beforeEach(async ({ page }) => {
    await page.goto("/demos/disclosures");
    // Interactive once hydrated. A click before that may be replayed, so look before clicking again.
    const button = page.getByTestId("expander").getByRole("button");
    const state = page.getByTestId("expander-state");
    await expect(async () => {
        if ((await state.textContent()) !== "Expanded: true") await button.click();
        await expect(state).toHaveText("Expanded: true", { timeout: 1000 });
    }).toPass({ timeout: 30_000 });
});

test("expander: the region comes and goes, by key too", async ({ page }) => {
    const expander = page.getByTestId("expander");
    await expect(expander.getByRole("region", { name: "More" })).toHaveText("Expanded body");
    await expander.getByRole("button").focus();
    await page.keyboard.press("Enter");
    await expect(expander.getByRole("region")).toHaveCount(0);
    await expect(page.getByTestId("expander-state")).toHaveText("Expanded: false");
    await page.keyboard.press("Space");
    await expect(expander.getByRole("button")).toHaveAttribute("aria-expanded", "true");
});

test("collapsible: the native keys reach Angular state", async ({ page }) => {
    await page.getByTestId("collapsible").locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("collapsible-state")).toHaveText("Collapsible: true");
    await page.keyboard.press("Space");
    await expect(page.getByTestId("collapsible-state")).toHaveText("Collapsible: false");
});

test("accordion list item: an li with a details that reaches Angular state", async ({ page }) => {
    const item = page.getByTestId("item");
    await expect(item.evaluate((node) => node.tagName)).resolves.toBe("LI");
    await item.locator("summary").click();
    await expect(page.getByTestId("item-state")).toHaveText("Item: true");
    await expect(item.getByText("Answer")).toBeVisible();
});

test("banners: dismissing removes them and reports", async ({ page }) => {
    await page.getByRole("button", { name: "Dismiss notice" }).click();
    await expect(page.getByTestId("banner").getByRole("region")).toHaveCount(0);
    await page.getByRole("button", { name: "Dismiss allergy" }).click();
    await expect(page.getByTestId("medical").getByRole("region")).toHaveCount(0);
    await expect(page.getByTestId("banner-state")).toHaveText("Closed: 2");
});

test("government banner: the toggle opens the panel", async ({ page }) => {
    const banner = page.getByTestId("government");
    await expect(banner.getByText("Official sites use")).toBeHidden();
    await banner.getByRole("button", { name: "How you know" }).click();
    await expect(banner.getByText("Official sites use")).toBeVisible();
    await expect(page.getByTestId("government-state")).toHaveText("Official: true");
});

test("sticky promo banner: fixed to the viewport, and it dismisses", async ({ page }) => {
    const promo = page.getByTestId("promo").locator("aside");
    await expect(promo).toBeInViewport();
    await promo.getByRole("button", { name: "Dismiss offer" }).click();
    await expect(promo).toBeHidden();
});

test("coachmark: open shows it under its anchor, and it dismisses", async ({ page }) => {
    const mark = page.getByTestId("coachmark").getByRole("dialog", { includeHidden: true });
    await expect(mark).toBeHidden();
    await page.getByTestId("coachmark-open").click();
    await expect(mark).toBeVisible();
    expect(await mark.evaluate((node) => node.matches(":popover-open"))).toBe(true);
    const trigger = (await page.getByTestId("coachmark-open").boundingBox())!;
    const box = (await mark.boundingBox())!;
    expect(Math.abs(box.y - (trigger.y + trigger.height))).toBeLessThan(2);
    await mark.getByRole("button", { name: "Close tip" }).click();
    await expect(mark).toBeHidden();
});

test("hover card: follows the pointer", async ({ page }) => {
    const card = page.getByTestId("card").locator("[role=tooltip]");
    await page.getByTestId("card-trigger").hover();
    await expect(card).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(card).toBeHidden();
});

test("tooltip: follows focus", async ({ page }) => {
    const tip = page.getByTestId("tooltip").locator("[role=tooltip]");
    await expect(tip).toBeHidden();
    await page.getByTestId("tooltip-trigger").focus();
    await expect(tip).toBeVisible();
    await expect(tip).toHaveText("Helpful text");
    await page.getByTestId("tooltip-trigger").blur();
    await expect(tip).toBeHidden();
});
