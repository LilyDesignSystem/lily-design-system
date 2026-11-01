import { test, expect } from "@playwright/test";

// The logo slot (P21-T4): the adopter's mark in a home link, named for the
// organisation, with the theme's shared clear space and minimum size.
test("the header logo is a named home link and the theme applies clear space and a minimum size", async ({ page }) => {
    await page.goto("/logo-slot.html");
    await page.waitForFunction(() => {
        const link = document.querySelector("link[data-lily-theme-picker]") as HTMLLinkElement | null;
        return link !== null && link.sheet !== null;
    });
    const link = page.getByRole("link", { name: "Example Organisation" });
    await expect(link).toHaveAttribute("href", "index.html");
    // The accessible name is the organisation's name, not "logo".
    await expect(page.getByRole("img", { name: "Example Organisation" })).toBeVisible();
    const style = await link.evaluate((a) => {
        const cs = getComputedStyle(a);
        const svg = getComputedStyle(a.querySelector("svg")!);
        return { padding: cs.paddingTop, minInline: svg.minInlineSize, display: cs.display };
    });
    expect(style.display).toBe("inline-block");
    expect(style.padding).toBe("8px"); // 0.5rem
    expect(style.minInline).toBe("128px"); // 8rem
});

test("with neither token set the slot adds no padding and no minimum", async ({ page }) => {
    await page.goto("/logo-slot.html");
    await page.addStyleTag({ content: ":root { --lily-logo-clear-space: initial; --lily-logo-min-size: initial; }" });
    const style = await page.getByRole("link", { name: "Example Organisation" }).evaluate((a) => ({
        padding: getComputedStyle(a).paddingTop,
        minInline: getComputedStyle(a.querySelector("svg")!).minInlineSize,
    }));
    expect(style.padding).toBe("0px");
    expect(["0px", "auto"]).toContain(style.minInline);
});
