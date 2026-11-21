import { test, expect } from "@playwright/test";

// The whole-card link (P22-T11): one link, in the heading, whose target covers the card; the card shows its focus
// ring; a button inside the card stays above it.
test.beforeEach(async ({ page }) => {
    await page.goto("/whole-card-link.html");
    await page.waitForFunction(() => {
        const link = document.querySelector(
            "link[data-lily-theme-picker]",
        ) as HTMLLinkElement | null;
        return link !== null && link.sheet !== null;
    });
});

test("the card holds one link, named by its heading", async ({ page }) => {
    const card = page.locator("main .card");
    await expect(card.getByRole("link")).toHaveCount(1);
    await expect(card.getByRole("link")).toHaveAccessibleName("Physiotherapy, 24 November");
});

test("the card's text is the link's target, and the button keeps its own", async ({ page }) => {
    const hit = await page.evaluate(() => {
        const card = document.querySelector("main .card")!;
        const at = (el: Element) => {
            const r = el.getBoundingClientRect();
            return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        };
        return {
            text: at(card.querySelector("p")!)?.closest("a, button")?.tagName,
            button: at(card.querySelector("button")!)?.closest("a, button")?.tagName,
        };
    });
    expect(hit.text).toBe("A");
    expect(hit.button).toBe("BUTTON");
});

test("keyboard focus on the link draws a visible ring round the card", async ({ page }) => {
    const card = page.locator("main .card");
    const link = card.getByRole("link");
    // Safari does not Tab to links by default, so focus the link from script after a key press, which still counts
    // as keyboard focus for :focus-visible in every engine.
    await page.keyboard.press("Shift");
    await link.focus();
    await expect(link).toBeFocused();
    expect(await link.evaluate((a) => a.matches(":focus-visible"))).toBe(true);
    const ring = await card.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { style: cs.outlineStyle, width: cs.outlineWidth };
    });
    expect(ring.style).toBe("solid");
    expect(ring.width).toBe("2px");
});
