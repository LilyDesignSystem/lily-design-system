import { test, expect } from '@playwright/test';

// Plan P3-T2: the theme-picker helper in the app shell switches the
// managed stylesheet and data-theme, persists to localStorage, and the
// choice survives a reload (re-applied pre-paint, then owned by the
// helper once the circuit starts). Mirrors the canonical SvelteKit
// spec, with one Blazor-server adaptation: the server-rendered button
// is inert until the SignalR circuit is interactive, and no DOM signal
// marks that moment — so opening retries the click until aria-expanded
// actually flips.

async function openPicker(page: import('@playwright/test').Page) {
  const button = page.getByRole('button', { name: 'Choose a theme' });
  await expect(async () => {
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
  }).toPass({ timeout: 15000 });
  return button;
}
test.describe('theme switching', () => {
  test('defaults to NHS England for patients', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('link[data-lily-theme-picker="theme"]');
    await expect(link).toHaveAttribute(
      'href',
      /united-kingdom-national-health-service-england-for-patients\.css$/
    );
  });

  test('selecting Dark applies stylesheet + data-theme and persists across reload', async ({ page }) => {
    await page.goto('/');
    await openPicker(page);
    await page.getByRole('option', { name: 'Dark' }).click();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    const link = page.locator('link[data-lily-theme-picker="theme"]');
    await expect(link).toHaveAttribute('href', /\/themes\/dark\.css$/);
    await expect(page.getByRole('button', { name: 'Choose a theme' })).toHaveAttribute('aria-expanded', 'false');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(link).toHaveAttribute('href', /\/themes\/dark\.css$/);
  });

  test('Escape closes without changing the theme', async ({ page }) => {
    await page.goto('/');
    const button = await openPicker(page);
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme',
      'united-kingdom-national-health-service-england-for-patients'
    );
  });
});
