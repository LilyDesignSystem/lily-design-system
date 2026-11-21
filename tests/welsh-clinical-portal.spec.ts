import { test, expect } from '@playwright/test';

const PRACTITIONERS = 'united-kingdom-national-health-service-wales-for-practitioners';

// /examples/welsh-clinical-portal/: a clinician's results screen built from headless components.
test.describe('example: /examples/welsh-clinical-portal/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/welsh-clinical-portal/');
    await expect(page.getByRole('grid', { name: 'Test results' })).toBeVisible();
    // The theme picker sets data-theme when it mounts, so this waits for hydration before any click.
    await expect(page.locator('html')).toHaveAttribute('data-theme', PRACTITIONERS);
  });

  test('opens in the NHS Wales practitioners theme and has none of the site chrome', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', PRACTITIONERS);
    await expect(page.locator('.site-header')).toHaveCount(0);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('shows the patient banner, the record tabs and the results', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Patient', exact: true })).toContainText('PHILLIPS, COLT (Mrs.)');
    await expect(page.getByRole('region', { name: 'Patient alerts' })).toContainText('Advance care plan discussed');
    await expect(page.getByRole('tab', { name: /^Tests/ })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Admit' })).toBeDisabled();
    await expect(page.getByRole('grid', { name: 'Test results' }).getByRole('row')).toHaveCount(2 + 7);
    await expect(page.getByText('Test Results 1 - 7 of 12')).toBeVisible();
  });

  test('every flag is also written in words, not only drawn', async ({ page }) => {
    await expect(page.getByRole('grid', { name: 'Test results' }).getByText('Abnormal')).toHaveCount(7);
  });

  test('another tab says it is not part of the example', async ({ page }) => {
    await page.getByRole('tab', { name: 'Events' }).click();
    await expect(page.getByRole('tabpanel')).toContainText('not part of the example');
  });

  test('has no horizontal scroll at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });

  test('choosing another theme restyles the same page', async ({ page }) => {
    await page.getByRole('button', { name: 'Theme' }).click();
    await page.getByRole('option', { name: 'NHS Wales (patients)' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'united-kingdom-national-health-service-wales-for-patients');
  });
});
