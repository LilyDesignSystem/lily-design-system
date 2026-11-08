// A keyboard focus indicator in every reference theme (WCAG 2.4.7, and the 2px of 2.4.13). The themes
// once wrote `outline: var(--lily-focus-ring)` for a file-tree item and a picker's keyboard cursor:
// a colour alone resets the outline style to none, so nothing was drawn (tasks.md P22-T10).
import { expect, test, type Page } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

const themes = readdirSync(path.join(here, "..", "..", "themes"))
    .filter((f) => f.endsWith(".css"))
    .map((f) => f.slice(0, -4));

async function useTheme(page: Page, slug: string) {
    await page.addInitScript((s) => localStorage.setItem("lily-theme", s), slug);
}

const outline = (page: Page) =>
    page.evaluate(() => {
        const s = getComputedStyle(document.activeElement as Element);
        return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
    });

// The theme alone, with no app stylesheet that might mask it: a theme is used on its own.
for (const slug of themes) {
    test(`${slug}: a focused file-tree item has a visible outline`, async ({ page }) => {
        const css = readFileSync(path.join(here, "..", "..", "themes", `${slug}.css`), "utf8");
        await page.setContent(
            `<style>${css}</style><ul class="file-tree" role="tree" aria-label="Files"><li role="treeitem" tabindex="0" aria-selected="false">src</li></ul>`,
        );
        await page.keyboard.press("Tab");
        const { style, width } = await outline(page);
        expect(style).not.toBe("none");
        expect(width).toBeGreaterThanOrEqual(2);
    });
}

test("a picker's keyboard cursor has a visible outline", async ({ page }) => {
    await useTheme(page, "abyss");
    await page.goto("/components/file-tree/");
    const button = page.locator(".theme-picker-button").first();
    await button.focus();
    await page.keyboard.press("ArrowDown");
    const active = page.locator(".theme-picker-list > [data-active]").first();
    await expect(active).toBeVisible();
    const style = await active.evaluate((el) => {
        const s = getComputedStyle(el);
        return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
    });
    expect(style.style).not.toBe("none");
    expect(style.width).toBeGreaterThanOrEqual(2);
});
