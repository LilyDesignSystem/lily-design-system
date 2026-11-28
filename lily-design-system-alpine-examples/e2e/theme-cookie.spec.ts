import { expect, test } from "@playwright/test";

// tasks.md P41-T5c, P48-T14: the theme picker keeps no cookie unless the app names one (cookieName), and this app names
// none. A first visit stores no cookie and no theme; choosing a theme stores it in localStorage and sets no cookie. (Other
// pickers may store their starting value on a first visit; that is P48-T14b, not this check.)
const themeKeys = () => Object.keys(localStorage).filter((key) => /theme/i.test(key));
// A framework's own cookie (ASP.NET's antiforgery token in Blazor) is not the picker's; only a theme cookie counts.
const themeCookies = async (context: import("@playwright/test").BrowserContext) =>
    (await context.cookies()).filter((cookie) => /theme/i.test(cookie.name));
test("a first visit stores nothing, and choosing a theme sets no cookie", async ({
    page,
    context,
}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await themeCookies(context)).toEqual([]);
    expect(await page.evaluate(themeKeys)).toEqual([]);

    const button = page.locator(".theme-picker-button").first();
    const select = page.locator("select.theme-picker-select, .site-header-pickers select").first();
    if (await button.count()) {
        // A framework app may not have hydrated yet: open and choose until the choice is stored.
        await expect(async () => {
            await button.click();
            await page.locator(".theme-picker-option").nth(1).click();
            expect((await page.evaluate(themeKeys)).length).toBeGreaterThan(0);
        }).toPass({ timeout: 20_000 });
    } else {
        const value = await select.locator("option").nth(1).getAttribute("value");
        await expect(async () => {
            await select.selectOption(value ?? "");
            expect((await page.evaluate(themeKeys)).length).toBeGreaterThan(0);
        }).toPass({ timeout: 20_000 });
    }
    expect(await themeCookies(context)).toEqual([]);
});
