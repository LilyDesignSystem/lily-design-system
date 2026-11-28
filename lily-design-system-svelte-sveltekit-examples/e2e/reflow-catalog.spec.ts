import { test, expect } from "@playwright/test";
import { components } from "../src/lib/data/components";

// tasks.md P49-T21 (WCAG 1.4.10): no component page scrolls sideways at 320 CSS pixels. A wide table sits in a labelled,
// focusable horizontal-scroller; media with a fixed width shrinks to its space (the themes' "Scoped overflow" section).
test.describe("reflow at 320px: full component catalog", () => {
    test.use({ viewport: { width: 320, height: 800 } });
    for (const c of components) {
        test(`/components/${c.slug}`, async ({ page }) => {
            await page.goto(`/components/${c.slug}`);
            const width = await page.evaluate(() => document.documentElement.scrollWidth);
            // A pixel for sub-pixel rounding, as responsive.spec.ts allows.
            expect(width, `/components/${c.slug} is ${width}px wide at 320px`).toBeLessThanOrEqual(
                321,
            );
        });
    }
});
