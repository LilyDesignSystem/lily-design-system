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

// P26-T1: scrolling chooses. Turning a wheel with the mouse and letting it settle makes the option in the middle the value,
// and that option is the one centred.
test("turning a wheel with the mouse chooses the option it settles on", async ({ page }) => {
    await page.goto("/time-wheels");
    const hours = page.getByRole("listbox", { name: "Hours" });
    await expect(page.locator("output")).toHaveText("09:30");
    const box = (await hours.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 200);
    await expect(page.locator("output")).not.toHaveText("09:30");
    const chosen = await hours.locator('[aria-selected="true"]').textContent();
    expect(Number(chosen)).toBeGreaterThan(9);
    await expect(page.locator('input[name="hour"]')).toHaveValue(chosen!);
    const offCentre = await hours.evaluate((list) => {
        const option = list.querySelector<HTMLElement>('[aria-selected="true"]')!;
        const a = list.getBoundingClientRect();
        const b = option.getBoundingClientRect();
        return Math.abs(b.top + b.height / 2 - (a.top + list.clientTop + list.clientHeight / 2));
    });
    expect(offCentre).toBeLessThanOrEqual(2);
});
