import { test, expect } from "@playwright/test";

// The several-wheels pattern (spec/detent-lessons, P26-T6): one fieldset named by its legend, one wheel picker per part,
// each its own field; Tab moves between the parts, and a form reset puts both back.

test("two wheels in one named group make one time, part by part", async ({ page }) => {
    await page.goto("/time-wheels");
    const group = page.getByRole("group", { name: "Appointment time" });
    const hours = group.getByRole("listbox", { name: "Hours" });
    const minutes = group.getByRole("listbox", { name: "Minutes" });
    await expect(hours).toBeVisible();
    await expect(minutes).toBeVisible();
    const output = page.locator("output");
    await expect(output).toHaveText("09:30");

    await hours.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");
    await expect(minutes).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(output).toHaveText("10:25");
    await expect(page.locator('input[name="hour"]')).toHaveValue("10");
    await expect(page.locator('input[name="minute"]')).toHaveValue("25");

    await page.getByRole("button", { name: "Book this time" }).click();
    await expect(page.getByText("Submitted: 10:25")).toBeVisible();

    await page.getByRole("button", { name: "Start again" }).click();
    await expect(output).toHaveText("09:30");
    await expect(page.locator('input[name="hour"]')).toHaveValue("09");
    await expect(hours.getByRole("option", { name: "09" })).toHaveAttribute(
        "aria-selected",
        "true",
    );
});
