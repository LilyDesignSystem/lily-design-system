import { test, expect } from "@playwright/test";

// The Blazor dialogs are real modals (tasks.md P14-T4), in a browser. /dialog-flow renders the real Dialog and
// AlertDialog; both open through Drawer.razor.js after the first interactive render (bUnit mocks that JS, so this is
// where it is shown to run). Asserted, in Chromium, Firefox and WebKit: Enter on the trigger opens it as a modal (:modal), focus moves inside, the page behind is
// inert (a click on the page's heading does not take focus), Escape closes it and focus returns to the trigger.

const route = "/dialog-flow";

for (const c of [
    { trigger: "Delete Account", dialog: "dialog.dialog", first: "Cancel" },
    { trigger: "Show Session Warning", dialog: "dialog.alert-dialog", first: "Dismiss" },
]) {
    test(`${c.dialog} opens as a real modal and Escape returns focus to "${c.trigger}"`, async ({
        page,
    }) => {
        await page.goto(route);
        const trigger = page.getByRole("button", { name: c.trigger });
        const dialog = page.locator(c.dialog);
        // The interactive circuit is up once a click renders the dialog.
        // Opened from the keyboard, the path where returning focus matters (WebKit on macOS does not focus a button
        // on click, so a click leaves no opener to return to). The circuit is up once Enter renders the dialog.
        await expect(async () => {
            await trigger.focus();
            await page.keyboard.press("Enter");
            await expect(dialog).toHaveCount(1, { timeout: 1000 });
        }).toPass({ timeout: 20_000 });
        await expect.poll(() => dialog.evaluate((d) => d.matches(":modal"))).toBe(true);
        await expect(page.getByRole("button", { name: c.first })).toBeFocused();
        // The page behind is inert: the trigger cannot take focus while the modal is open.
        await trigger.evaluate((b) => (b as HTMLElement).focus());
        await expect(trigger).not.toBeFocused();
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
    });
}
