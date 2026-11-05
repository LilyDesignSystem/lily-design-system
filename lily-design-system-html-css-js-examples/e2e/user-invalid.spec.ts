import { test, expect } from "@playwright/test";

// P22-T9: invalid styling comes from the native :user-invalid (after interaction) and from aria-invalid
// (server-rendered errors), so a required field is not styled invalid on page load.
const errorColour = (page) =>
    page.evaluate(() => {
        const probe = document.createElement("span");
        probe.style.color = "var(--color-error)";
        document.body.appendChild(probe);
        const c = getComputedStyle(probe).color;
        probe.remove();
        return c;
    });
const border = (page) =>
    page.locator("#name").evaluate((el) => getComputedStyle(el).borderTopColor);

test.describe("invalid styling", () => {
    test("a required empty field is not invalid on load, is after the user edits it and leaves", async ({
        page,
    }) => {
        await page.goto("/contact-form.html");
        const err = await errorColour(page);
        expect(await border(page)).not.toBe(err);
        await page.locator("#name").fill("x");
        await page.locator("#name").fill("");
        await page.locator("#name").blur();
        await expect.poll(() => border(page)).toBe(err);
    });

    test("a field with aria-invalid is styled invalid at once", async ({ page }) => {
        await page.goto("/contact-form.html");
        await page.locator("#name").evaluate((el) => el.setAttribute("aria-invalid", "true"));
        const err = await errorColour(page);
        await expect.poll(() => border(page)).toBe(err);
    });
});
