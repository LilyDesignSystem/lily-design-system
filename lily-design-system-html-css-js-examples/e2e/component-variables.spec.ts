import { expect, test } from "@playwright/test";

test("an inline component variable restyles one button", async ({ page }) => {
    await page.goto("/contact-form.html");

    const button = page.getByRole("button", { name: "Send Message" });
    await expect(button).toBeVisible();
    await button.evaluate((element) => {
        element.style.setProperty("--lily-button-background", "rgb(12, 34, 56)");
        element.style.setProperty("--lily-button-color", "rgb(250, 251, 252)");
    });

    // The reference theme transitions button colours for 120ms. Poll the
    // resolved style so this proves the final variable value, not a frame in
    // the transition.
    await expect
        .poll(() =>
            button.evaluate((element) => {
                const style = getComputedStyle(element);
                return [style.backgroundColor, style.color];
            }),
        )
        .toEqual(["rgb(12, 34, 56)", "rgb(250, 251, 252)"]);
});
