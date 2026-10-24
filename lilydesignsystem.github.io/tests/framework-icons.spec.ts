import { test, expect, type Page } from '@playwright/test';

// The home page's framework icon row: labels, order, and that every icon sits on one row.

const LABELS = ['Svelte', 'React', 'Vue', 'Angular', 'Blazor', 'Nunjucks', 'Alpine', 'HTML', 'Web'];

// Home pages that render the row: the English home and a locale home (LocaleHome.svelte).
const PAGES = ['/', '/cy-gb/', '/en-us/'];

async function rowBoxes(page: Page) {
  const links = page.locator('.framework-icon-row .framework-icon-link');
  await expect(links.first()).toBeVisible();
  return links.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      const img = el.querySelector('img') as HTMLImageElement;
      return {
        label: el.querySelector('span')?.textContent?.trim() ?? '',
        top: Math.round(r.top),
        left: Math.round(r.left),
        right: Math.round(r.right),
        imgLoaded: img.complete && img.naturalWidth > 0,
      };
    })
  );
}

for (const path of PAGES) {
  test.describe(`framework icon row on ${path}`, () => {
    test('is labelled Svelte, React, Vue, Angular, Blazor, Nunjucks, Alpine, HTML, Web, in that order', async ({ page }) => {
      await page.goto(path);
      const boxes = await rowBoxes(page);
      expect(boxes.map((b) => b.label)).toEqual(LABELS);
      // Left to right matches the DOM order.
      const lefts = boxes.map((b) => b.left);
      expect(lefts).toEqual([...lefts].sort((a, b) => a - b));
    });

    test('Alpine sits between Nunjucks and HTML and the old names are gone', async ({ page }) => {
      await page.goto(path);
      const text = await page.locator('.framework-icon-row').innerText();
      expect(text).not.toContain('Alpine.js');
      expect(text).not.toContain('Web Components');
      const labels = (await rowBoxes(page)).map((b) => b.label);
      expect(labels.indexOf('Alpine')).toBe(labels.indexOf('Nunjucks') + 1);
      expect(labels.indexOf('HTML')).toBe(labels.indexOf('Alpine') + 1);
    });

    test('every icon image loads', async ({ page }) => {
      await page.goto(path);
      const boxes = await rowBoxes(page);
      expect(boxes.filter((b) => !b.imgLoaded).map((b) => b.label)).toEqual([]);
    });

    for (const width of [1920, 1280, 1024, 900]) {
      test(`all nine icons render on one row at ${width}px wide`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const boxes = await rowBoxes(page);
        expect(boxes).toHaveLength(LABELS.length);
        const tops = new Set(boxes.map((b) => b.top));
        expect([...tops], `icon tops at ${width}px: ${JSON.stringify(boxes.map((b) => [b.label, b.top]))}`).toHaveLength(1);
        // And none is clipped off the right edge.
        expect(Math.max(...boxes.map((b) => b.right))).toBeLessThanOrEqual(width);
        // Breaking out of the intro column must not make the page scroll sideways.
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}
