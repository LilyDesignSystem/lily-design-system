import { expect, test } from "@playwright/test";
import { THEMES } from "../src/lib/themes";

// "Light High-Contrast" and "Dark High-Contrast" (WCAG 2.2 AAA, 1.4.6): body text, links and the page's own surfaces meet 7:1
// in the real page, chosen through the real theme picker, and each is listed under the name the picker shows.
const CASES = [
    { slug: "light-high-contrast", label: "Light High-Contrast", scheme: "light" },
    { slug: "dark-high-contrast", label: "Dark High-Contrast", scheme: "dark" },
] as const;

for (const { slug, label, scheme } of CASES) {
    test(`${label} is offered by the picker and meets 7:1 on the page`, async ({ page }) => {
        expect(THEMES).toContain(slug);
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        const button = page.locator(".theme-picker-button");
        await expect(async () => {
            if ((await button.getAttribute("aria-expanded")) !== "true") await button.click();
            await expect(button).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
        }).toPass({ timeout: 10000 });
        await page.getByRole("option", { name: label, exact: true }).click();
        await expect(page.locator("html")).toHaveAttribute("data-theme", slug);
        await page.waitForTimeout(200);
        const ratios = await page.evaluate(() => {
            const luminance = (colour: string) => {
                const ctx = document.createElement("canvas").getContext("2d")!;
                ctx.fillStyle = colour;
                ctx.fillRect(0, 0, 1, 1);
                const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
                    .slice(0, 3)
                    .map((v) => {
                        const s = v / 255;
                        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
                    });
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            };
            const ratio = (a: string, b: string) => {
                const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
                return (hi + 0.05) / (lo + 0.05);
            };
            const style = (element: Element) => getComputedStyle(element);
            const background = style(document.body).backgroundColor;
            const link = document.querySelector("main a") ?? document.querySelector("a")!;
            return {
                text: ratio(style(document.body).color, background),
                link: ratio(style(link).color, background),
                scheme: style(document.documentElement).colorScheme,
            };
        });
        expect(ratios.scheme).toContain(scheme);
        expect(ratios.text).toBeGreaterThanOrEqual(7);
        expect(ratios.link).toBeGreaterThanOrEqual(7);
    });
}
