import { test, expect } from "@playwright/test";

// The colour-picker helper in a form (spec/helpers, color-picker contract): one named group, a palette of named radios
// whose Up and Down keys move a row, recent colours, exact entry with an invalid entry marked, form submission and reset.

test("a palette swatch, a typed hex value and the keyboard all choose a colour", async ({
    page,
}) => {
    await page.goto("/color-picker");
    const picker = page.getByRole("group", { name: "Highlight colour" });
    await expect(picker).toBeVisible();
    const output = page.locator("output");
    await expect(output).toHaveText("#005eb8");

    const palette = picker.getByRole("radiogroup", { name: "Colours", exact: true });
    // exact: "Colours" alone would also match "Recent colours".
    const swatches = palette.getByRole("radio");
    await expect(swatches).toHaveCount(80);

    // A click chooses, and the colour joins the recent row.
    const third = swatches.nth(12);
    const thirdValue = (await third.getAttribute("value"))!;
    await third.click();
    await expect(output).toHaveText(thirdValue);
    const recent = picker.getByRole("radiogroup", { name: "Recent colours" }).getByRole("radio");
    await expect(recent).toHaveCount(1);
    await expect(recent.first()).toHaveAttribute("value", thirdValue);

    // ArrowDown moves one row of ten and chooses.
    await page.keyboard.press("ArrowDown");
    const below = swatches.nth(22);
    await expect(below).toBeFocused();
    await expect(output).toHaveText((await below.getAttribute("value"))!);

    // A wrong hex value is marked and changes nothing; a right one applies on Enter.
    const hex = picker.getByLabel("Hex", { exact: true });
    const before = await output.textContent();
    await hex.fill("#zz");
    await hex.press("Enter");
    await expect(hex).toHaveAttribute("aria-invalid", "true");
    await expect(picker.getByText("Not a colour.", { exact: false })).toBeVisible();
    await expect(output).toHaveText(before!);
    await hex.fill("#FF6347");
    await hex.press("Enter");
    await expect(output).toHaveText("#ff6347");
    await expect(picker.getByLabel("Colour name")).toHaveValue("tomato");

    // Transparent says so with aria-pressed.
    const transparent = picker.getByRole("button", { name: "Transparent" });
    await transparent.click();
    await expect(transparent).toHaveAttribute("aria-pressed", "true");
    await expect(output).toHaveText("transparent");
});

test("the colour submits with the form, and a reset restores the start", async ({ page }) => {
    await page.goto("/color-picker");
    const picker = page.getByRole("group", { name: "Highlight colour" });
    const name = picker.getByLabel("Colour name");
    await name.fill("gold");
    await name.press("Enter");
    await expect(page.locator("output")).toHaveText("#ffd700");

    await page.getByRole("button", { name: "Save colour" }).click();
    await expect(page.getByText("Saved: #ffd700")).toBeVisible();

    await page.getByRole("button", { name: "Start again" }).click();
    await expect(page.locator("output")).toHaveText("#005eb8");
    await expect(page.locator('input[name="highlight"]')).toHaveValue("#005eb8");
});
