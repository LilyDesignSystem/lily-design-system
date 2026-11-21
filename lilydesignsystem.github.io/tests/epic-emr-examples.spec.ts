import { test, expect } from '@playwright/test';

// The four EMR-style example pages share one shell (src/lib/emr/EmrShell.svelte).
const PAGES = [
  { path: '/examples/epic-emr-patient-lists-patient-lookup/', title: /index and patient lookup/i },
  { path: '/examples/epic-emr-patient-summary-overview/', title: /summary overview/i },
  { path: '/examples/epic-emr-patient-summary-overview-vital-signs/', title: /vital signs/i },
  { path: '/examples/epic-emr-patient-surgical-specialty/', title: /Surgical Specialty/i }
];

for (const { path, title } of PAGES) {
  test.describe(`example: ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      // The theme picker sets data-theme when it mounts, so this waits for hydration before any click.
      await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
    });

    test('has the landmarks and none of the site chrome', async ({ page }) => {
      await expect(page).toHaveTitle(title);
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.locator('.site-header')).toHaveCount(0);
      await expect(page.getByRole('link', { name: 'Skip to main content' })).toHaveCount(1);
    });

    test('has no horizontal scroll at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    });
  });
}

test('the summary tabs link the Index and the Overview', async ({ page }) => {
  await page.goto('/examples/epic-emr-patient-summary-overview/');
  await expect(page.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Index', exact: true }).click();
  await expect(page).toHaveURL(/epic-emr-patient-lists-patient-lookup/);
  await expect(page.getByRole('link', { name: 'Index', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('the index filters its links', async ({ page }) => {
  await page.goto('/examples/epic-emr-patient-lists-patient-lookup/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('searchbox', { name: 'Find in the index' }).fill('microbiology');
  await expect(page.getByRole('link', { name: 'Microbiology Results' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Handoff Report' })).toHaveCount(0);
  await page.getByRole('searchbox', { name: 'Find in the index' }).fill('zzz');
  await expect(page.getByText('No index entries match')).toBeVisible();
});

test('the vital signs chart has a text name and a table of the same readings', async ({ page }) => {
  await page.goto('/examples/epic-emr-patient-summary-overview-vital-signs/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await expect(page.getByRole('img', { name: /Vital signs for the last eight readings/ })).toBeVisible();
  const toggle = page.getByRole('button', { name: 'View table' });
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Hide table' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('grid', { name: 'Vital signs readings' }).getByRole('row')).toHaveCount(1 + 8);
});

test('every status mark on the patient list is also written in words', async ({ page }) => {
  await page.goto('/examples/epic-emr-patient-surgical-specialty/');
  const table = page.getByRole('grid', { name: /Patients on the Surgical Specialty list/ });
  await expect(table.getByRole('row')).toHaveCount(1 + 7);
  await expect(table.getByText('Needs attention').first()).toBeAttached();
  await expect(table.getByRole('columnheader', { name: 'New result flag' })).toBeVisible();
});

test('choosing a list on the patient lists page renames the list', async ({ page }) => {
  await page.goto('/examples/epic-emr-patient-surgical-specialty/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('button', { name: 'Paediatrics' }).click();
  await expect(page.getByRole('heading', { level: 2, name: /^Paediatrics/ })).toBeVisible();
});
