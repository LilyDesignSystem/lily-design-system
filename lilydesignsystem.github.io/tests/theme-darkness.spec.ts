import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';

// Every theme in static/assets/themes, chosen through the real theme picker, must paint the page the way its own
// `color-scheme` says: dark themes get a dark page, card and light text; light themes the reverse. This guards the
// 2026-10-20 bug where the site's own :root hard-coded light surface tokens and every dark theme still showed a
// near-white page.

const DIR = 'static/assets/themes';
const themes = readdirSync(DIR)
  .filter((f) => f.endsWith('.css'))
  .map((f) => {
    const css = readFileSync(`${DIR}/${f}`, 'utf8');
    const scheme = /color-scheme:\s*(dark|light)/.exec(css)?.[1] ?? 'light';
    return { slug: f.replace(/\.css$/, ''), scheme };
  })
  // The picker lists general and design-system themes alphabetically, then the UK and US government themes.
  .sort((a, b) => Number(a.slug.startsWith('united-')) - Number(b.slug.startsWith('united-')) || a.slug.localeCompare(b.slug));

test('there are 57 themes and the picker offers all of them', async ({ page }) => {
  expect(themes).toHaveLength(57);
  await page.goto('/');
  await page.locator('.theme-picker-button').click();
  await expect(page.locator('.theme-picker-option')).toHaveCount(57);
});

themes.forEach(({ slug, scheme }, index) => {
  test(`${slug} (${scheme}) paints a ${scheme} page`, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const button = page.locator('.theme-picker-button');
    // Retry the open: a click before hydration is swallowed.
    await expect(async () => {
      if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click();
      await expect(button).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
    }).toPass({ timeout: 10000 });
    await page.locator('.theme-picker-option').nth(index).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', slug);
    await page.waitForTimeout(200);
    const c = await page.evaluate(() => {
      const cs = (e: Element) => getComputedStyle(e);
      // Resolve any CSS colour (the themes use oklch) to sRGB through a canvas, then to relative luminance.
      const lum = (colour: string) => {
        const ctx = document.createElement('canvas').getContext('2d')!;
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
      const body = cs(document.body).backgroundColor;
      const text = cs(document.body).color;
      const card = cs(document.querySelector('.card') ?? document.body).backgroundColor;
      return {
        scheme: cs(document.documentElement).colorScheme,
        body, text, card,
        bg: lum(body), textLum: lum(text), cardLum: lum(card)
      };
    });
    const { bg, cardLum: card, textLum: text } = c;
    // Text must stay readable on the page: WCAG contrast of at least 4.5:1.
    const contrast = (Math.max(bg, text) + 0.05) / (Math.min(bg, text) + 0.05);
    expect(contrast, `text ${c.text} on page ${c.body}`).toBeGreaterThanOrEqual(4.5);
    if (scheme === 'dark') {
      expect(c.scheme).toContain('dark');
      expect(bg, `page ${c.body}`).toBeLessThan(0.2);
      expect(card, `card ${c.card}`).toBeLessThan(0.25);
    } else {
      expect(bg, `page ${c.body}`).toBeGreaterThan(0.3);
      expect(card, `card ${c.card}`).toBeGreaterThan(0.3);
    }
  });
});
