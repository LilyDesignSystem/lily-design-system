import { test, expect, type Page } from "@playwright/test";

// The form-validation pattern (docs/patterns/form-validation, tasks.md P23-T9), on the booking flow's details step.
async function toDetails(page: Page) {
    await page.goto("/book-an-appointment.html");
    await page.getByRole("button", { name: "Start now" }).click();
    await page.getByLabel("Routine check-up").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator("#appointment-date").fill("2027-01-15");
    await page.locator("#appointment-time").selectOption("morning");
    await page.getByRole("button", { name: "Continue" }).click();
}

test("nothing is invalid before the person has answered", async ({ page }) => {
    await toDetails(page);
    for (const id of ["#full-name", "#email"]) {
        await expect(page.locator(id)).not.toHaveAttribute("aria-invalid", "true");
        expect(await page.locator(id).evaluate((el) => el.matches(":user-invalid"))).toBe(false);
    }
    await expect(page.locator("#booking-error-summary")).toBeHidden();
});

test("each summary link moves focus to its field, which is marked invalid with its message", async ({
    page,
}) => {
    await toDetails(page);
    await page.locator("#email").fill("not-an-email");
    await page.getByRole("button", { name: "Continue" }).click();
    const summary = page.locator("#booking-error-summary");
    await expect(summary).toBeFocused();

    const link = summary.getByRole("link", {
        name: "Enter an email address in the correct format",
    });
    await expect(link).toHaveAttribute("href", "#email");
    await link.click();
    await expect(page.locator("#email")).toBeFocused();

    const email = page.locator("#email");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    const messageId = await email.getAttribute("aria-errormessage");
    expect(messageId).toBeTruthy();
    const message = page.locator(`#${messageId}`);
    await expect(message).toBeVisible();
    await expect(message).toContainText("Enter an email address in the correct format");

    await summary.getByRole("link", { name: "Enter your full name" }).click();
    await expect(page.locator("#full-name")).toBeFocused();
});
