import { test, expect } from '@playwright/test';

// Plan P3-T3: locale-picker and text-size-picker sit in the app shell
// beside theme-picker. Locale application is lang + dir on the document
// root (Arabic exercises the rtl flip; Welsh's label is the endonym,
// supplied by the helper itself); text size is data-text-size.
test.describe('site preferences', () => {
  test('locale picker applies lang, flips dir for Arabic, persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await page.getByRole('button', { name: 'Choose a language' }).click();
    await page.getByRole('option', { name: 'Cymraeg' }).click();
    await expect(html).toHaveAttribute('lang', 'cy-GB');
    await expect(html).toHaveAttribute('dir', 'ltr');

    await page.getByRole('button', { name: 'Choose a language' }).click();
    await page.getByRole('option', { name: 'العربية' }).click();
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');

    await page.reload();
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('text size picker applies data-text-size and persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await page.getByRole('button', { name: 'Text size' }).click();
    await page.getByRole('option', { name: 'Large' }).click();
    await expect(html).toHaveAttribute('data-text-size', 'large');

    await page.reload();
    await expect(html).toHaveAttribute('data-text-size', 'large');
  });
});
