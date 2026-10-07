import { test, expect } from '@playwright/test';

// The header's link picker (a home icon) is the leftmost picker and lists pages the site actually has.

test.describe('header link picker', () => {
  test('is the first picker in the header, named "Pages", with the site pages as real links', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForSelector('link[data-lily-theme-picker]', { state: 'attached' });
    const first = page.locator('.site-preferences > div').first();
    await expect(first).toHaveClass(/link-picker/);
    await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();
    await page.getByRole('button', { name: 'Pages' }).click();
    const links = page.locator('.link-picker-link');
    await expect(links).toHaveCount(4);
    expect(await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')))).toEqual(['/', '/about/', '/help/', '/why/']);
    // The page we are on is marked.
    await expect(page.locator('.link-picker-link[aria-current="page"]')).toHaveText(/About/);
  });

  test('a click navigates client-side to the chosen page', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForSelector('link[data-lily-theme-picker]', { state: 'attached' });
    await page.getByRole('button', { name: 'Pages' }).click();
    await page.locator('.link-picker-link[href="/why/"]').click();
    await page.waitForURL('**/why/');
    await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();
  });

  test('in Welsh the picker, its name and its links are Welsh, and Home goes to the Welsh home', async ({ page }) => {
    await page.goto('/cy-gb/');
    await page.waitForSelector('link[data-lily-theme-picker]', { state: 'attached' });
    await page.getByRole('button', { name: 'Tudalennau' }).click();
    await expect(page.locator('.link-picker-link').first()).toHaveAttribute('href', '/cy-gb/');
    await expect(page.locator('.link-picker-link[aria-current="page"]')).toHaveText('Hafan');
  });

  test('keyboard: ArrowDown opens at the first link, Escape closes and returns focus', async ({ page }) => {
    await page.goto('/help/');
    await page.waitForSelector('link[data-lily-theme-picker]', { state: 'attached' });
    await page.getByRole('button', { name: 'Pages' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.link-picker-link').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Pages' })).toBeFocused();
  });
});
