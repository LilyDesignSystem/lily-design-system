import { test, expect } from '@playwright/test';

// Plan P3-T1: the theme-picker helper in the app shell switches the
// managed stylesheet and data-theme, persists to localStorage, and the
// choice survives a reload (re-applied pre-paint by app.html's script,
// then owned again by the helper after hydration).
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
    await page.getByRole('button', { name: 'Choose a theme' }).click();
    await page.getByRole('option', { name: 'Dark' }).click();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    const link = page.locator('link[data-lily-theme-picker="theme"]');
    await expect(link).toHaveAttribute('href', /\/themes\/dark\.css$/);
    // pointer selection closes the listbox (AGENTS/helpers.md contract)
    await expect(page.getByRole('button', { name: 'Choose a theme' })).toHaveAttribute('aria-expanded', 'false');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(link).toHaveAttribute('href', /\/themes\/dark\.css$/);
  });

  test('Escape closes without changing the theme', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Choose a theme' });
    await button.click();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme',
      'united-kingdom-national-health-service-england-for-patients'
    );
  });
});
