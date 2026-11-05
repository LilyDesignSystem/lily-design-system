import { expect, test } from "@playwright/test";

const KINDS = [
    "dialog",
    "alert-dialog",
    "file-dialog",
    "timeout-dialog",
    "drawer",
    "sheet",
    "slide-out-drawer",
];

for (const kind of KINDS) {
    test(`${kind}: opens as a real modal, takes focus and gives it back`, async ({ page }) => {
        await page.goto("/demos/modals");
        const opener = page.getByTestId(`open-${kind}`);
        const modal = page.locator(`dialog.${kind}`);

        // By keyboard: WebKit does not focus a clicked button, so there would be no opener to return to.
        // Opening is idempotent, so pressing again before hydration finishes does no harm.
        await expect(async () => {
            await opener.focus();
            await page.keyboard.press("Enter");
            await expect(modal).toBeVisible({ timeout: 1000 });
        }).toPass();

        expect(await modal.evaluate((el) => el.matches(":modal"))).toBe(true);
        expect(await modal.evaluate((el) => el.contains(document.activeElement))).toBe(true);

        await page.getByTestId(`close-${kind}`).click();
        await expect(modal.and(page.locator("[open]"))).toHaveCount(0);
        await expect(opener).toBeFocused();
    });
}

test("dialog: Escape closes it", async ({ page }) => {
    await page.goto("/demos/modals");
    const modal = page.locator("dialog.dialog");
    await expect(async () => {
        await page.getByTestId("open-dialog").focus();
        await page.keyboard.press("Enter");
        await expect(modal).toBeVisible({ timeout: 1000 });
    }).toPass();
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    await expect(page.getByTestId("open-dialog")).toBeFocused();
});

test("modals open on first render: the static page is whole, and the browser opens them", async ({
    page,
    request,
}) => {
    const html = await (await request.get("/demos/modals-open")).text();
    expect(html).toContain("The page around them is still in the static HTML.");
    expect(html).toContain("Dialog body");
    expect(html).toContain("Drawer body");
    expect(html).not.toMatch(/<dialog[^>]* open/);

    const problems: string[] = [];
    page.on("pageerror", (e) => problems.push(e.message));
    page.on("console", (m) => {
        if (m.type() === "error" && /NG0|hydrat/i.test(m.text())) problems.push(m.text());
    });
    await page.goto("/demos/modals-open");
    await expect(page.locator("dialog.dialog")).toBeVisible();
    await expect(page.locator("dialog.drawer")).toBeVisible();
    expect(await page.locator("dialog.dialog").evaluate((el) => el.matches(":modal"))).toBe(true);
    expect(await page.locator("dialog.drawer").evaluate((el) => el.matches(":modal"))).toBe(true);
    expect(problems).toEqual([]);
});
