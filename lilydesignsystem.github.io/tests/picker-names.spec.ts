import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// P41-T9: the site header's picker names come from the language's label pack (spec/label-packs, "Picker names"), not from
// hand-written strings: the buttons are named by the pack's own `pickers` section, in the page's language, with a regional
// route (de-at) using its language's pack (de-001).
const PACKS = "node_modules/@lilydesignsystem/svelte-locale-translations/label-packs";
const pickers = (language: string) =>
    JSON.parse(readFileSync(`${PACKS}/${language}-001.json`, "utf8")).pickers as Record<
        string,
        string
    >;

const ROUTES: [string, string][] = [
    ["/en-001/", "en"],
    ["/cy-gb/", "cy"],
    ["/de-at/", "de"],
    ["/ja-jp/", "ja"],
    ["/ar-001/", "ar"],
];

for (const [route, language] of ROUTES) {
    test(`${route} names its pickers from the ${language}-001 pack`, async ({ page }) => {
        await page.goto(route);
        const names = pickers(language);
        for (const key of ["theme", "locale", "textSize", "share"]) {
            await expect(
                page.locator(`.site-preferences button[aria-label="${names[key]}"]`).first(),
                `${route} ${key}`,
            ).toBeVisible();
        }
    });
}

test("the English names are the pack's, plural by design", async ({ page }) => {
    await page.goto("/en-001/");
    await expect(page.getByRole("button", { name: "Themes", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Locales", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Text Sizes", exact: true })).toBeVisible();
});
