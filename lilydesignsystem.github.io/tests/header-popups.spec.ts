import { test, expect } from '@playwright/test';

// Regression: the header pickers' popups must stay inside the viewport. The theme list is wider than the
// space to the right of its button, so it used to overflow and focusing it scrolled the whole page sideways.

const pickers = ['link-picker', 'theme-picker', 'locale-picker', 'text-size-picker', 'share-picker', 'search-picker'];

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 390, height: 800 }
]) {
  test.describe(`header popups at ${viewport.width}px`, () => {
    test.use({ viewport });

    for (const picker of pickers) {
      test(`${picker} opens without scrolling or overflowing the page`, async ({ page }) => {
        await page.goto('/');
        // The theme stylesheet is loaded at runtime by the theme picker; wait for it.
        await page.waitForSelector('link[data-lily-theme-picker]', { state: 'attached' });
        await page.locator(`.${picker}-button`).first().click();
        const popup = page.locator(`.${picker}-list, .${picker}-panel`).first();
        await expect(popup).toBeVisible();
        const m = await page.evaluate(() => ({
          scrollX,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        }));
        expect(m.scrollX, 'page scrolled sideways').toBe(0);
        expect(m.overflow, 'page wider than the window').toBe(false);
        const box = await popup.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      });
    }
  });
}
