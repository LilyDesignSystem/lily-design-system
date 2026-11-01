import { test, expect } from "@playwright/test";

// Menu popovers in Blazor (plan P18-T11). Runs the real DropdownMenu and ContextMenu on /demos/menu-popover. Their
// menus are popover="auto"; the toggle event reaching .NET and the APG menu focus code both go through
// Popover.razor.js, loaded through JS interop after the first interactive render, so these checks prove the interop
// runs in a browser (bUnit mocks it).
//
// What IS asserted, in Chromium, Firefox and WebKit:
//   - the dropdown trigger opens its menu (:popover-open), aria-expanded and the bound Open follow, and the first
//     item takes focus; ArrowDown wraps, Home and End jump; Escape closes it and the bound Open follows;
//   - a click outside light-dismisses it;
//   - the context menu opens from Open (a right-click), focuses its first item, and Escape writes Open back.
// What is NOT asserted: positioning (consumer CSS).

const route = "/demos/menu-popover";

async function focusedText(page) {
    return page.evaluate(() => document.activeElement?.textContent?.trim());
}

test.describe("menu popovers (Blazor)", () => {
    test("dropdown menu: opens as a popover, roving focus, Escape and light dismiss", async ({
        page,
    }) => {
        await page.goto(route);
        const root = page.getByTestId("dropdown");
        const trigger = root.locator("button");
        const menu = root.locator("[role=menu]");
        const state = page.getByTestId("dropdown-state");
        // The interactive circuit is up once a click reaches .NET (the state line follows the toggle event).
        await expect(async () => {
            await trigger.click();
            await expect(state).toHaveText("Dropdown open: yes", { timeout: 1000 });
        }).toPass({ timeout: 20_000 });
        expect(await menu.evaluate((m) => m.matches(":popover-open"))).toBe(true);
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await expect.poll(() => focusedText(page)).toBe("Edit");
        await page.keyboard.press("ArrowDown");
        await expect.poll(() => focusedText(page)).toBe("Duplicate");
        await page.keyboard.press("End");
        await expect.poll(() => focusedText(page)).toBe("Delete");
        await page.keyboard.press("ArrowDown");
        await expect.poll(() => focusedText(page)).toBe("Edit");
        await page.keyboard.press("Home");
        await expect.poll(() => focusedText(page)).toBe("Edit");
        await page.keyboard.press("Escape");
        await expect(state).toHaveText("Dropdown open: no");
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        expect(await menu.evaluate((m) => m.matches(":popover-open"))).toBe(false);

        await trigger.click();
        await expect(state).toHaveText("Dropdown open: yes");
        await page.mouse.click(2, 2);
        await expect(state).toHaveText("Dropdown open: no");
    });

    test("context menu: Open shows it as a popover, Escape writes Open back", async ({ page }) => {
        await page.goto(route);
        const target = page.getByTestId("context-target");
        const menu = page.getByTestId("context");
        const state = page.getByTestId("context-state");
        await expect(async () => {
            await target.click({ button: "right" });
            await expect(state).toHaveText("Context menu open: yes", { timeout: 1000 });
        }).toPass({ timeout: 20_000 });
        await expect.poll(() => menu.evaluate((m) => m.matches(":popover-open"))).toBe(true);
        await expect.poll(() => focusedText(page)).toBe("Cut");
        await page.keyboard.press("ArrowUp");
        await expect.poll(() => focusedText(page)).toBe("Paste");
        await page.keyboard.press("Escape");
        await expect(state).toHaveText("Context menu open: no");
        expect(await menu.evaluate((m) => m.matches(":popover-open"))).toBe(false);
    });
});
