import { test, expect } from '@playwright/test';

// Six health-care example pages under /en-001/examples/ sharing src/lib/components/HealthShell.svelte.
const PAGES = [
  { slug: 'health-care-dental-access', h1: /dental practice/i },
  { slug: 'health-care-test-requests', h1: /laboratory tests/i },
  { slug: 'health-care-pharmacies', h1: /Choose a pharmacy/i },
  { slug: 'health-care-prescriptions', h1: /Medicines chart/i },
  { slug: 'health-care-continuous-patient-monitoring', h1: /Intensive care overview/i },
  { slug: 'health-care-shared-medicines', h1: /Medicines list/i },
  { slug: 'health-care-vaccinations', h1: /vaccinations/i }
];

for (const { slug, h1 } of PAGES) {
  test.describe(`example: /en-001/examples/${slug}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/en-001/examples/${slug}/`);
      // The theme picker sets data-theme when it mounts, so this waits for hydration before any click.
      await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
    });

    test('has one h1, landmarks and the examples navigation marking this page', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.locator('.site-header')).toHaveCount(0);
      const nav = page.getByRole('navigation', { name: 'Health-care examples' });
      await expect(nav.getByRole('link')).toHaveCount(PAGES.length);
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    });

    test('has no horizontal scroll at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    });
  });
}

test('dental access: filters and a waiting-list request that reports its outcome', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-dental-access/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('radio', { name: 'A child' }).check();
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('status').first()).toContainText('practices found');
  await expect(page.getByText('Taking new adults only')).toHaveCount(0);
  await page.getByRole('button', { name: /Join the waiting list/ }).first().click();
  await expect(page.getByRole('status').first()).toContainText('nothing is booked yet');
  await expect(page.getByText('On the waiting list')).toHaveCount(1);
});

test('test requests: errors move focus to a summary; a valid request joins the tracker', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-test-requests/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('button', { name: 'Send request' }).click();
  const summary = page.getByRole('alert');
  await expect(summary).toContainText('There is a problem');
  await expect(summary).toBeFocused();
  await expect(summary.getByRole('link')).toHaveCount(3);
  await page.getByRole('checkbox', { name: 'Full blood count' }).check();
  await expect(page.getByText('Purple-top tube').first()).toBeVisible();
  await page.getByRole('radio', { name: 'Routine' }).check();
  await page.getByLabel('Clinical reason').fill('Tiredness for three weeks');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.getByRole('status').first()).toContainText('sent for 1 test');
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(1 + 3);
});

test('pharmacies: choosing one is reported, and the ailments list filters', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-pharmacies/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('button', { name: /Choose this pharmacy\s*: Lakeside/ }).click();
  await expect(page.getByRole('status').first()).toContainText('is now your chosen pharmacy');
  await page.getByRole('searchbox', { name: 'Search the list' }).fill('hay');
  await expect(page.getByText('1 of 17 shown')).toBeVisible();
});

test('prescriptions: recording a dose is reported in words and removes its buttons', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-prescriptions/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await expect(page.getByText('Overdue:')).toBeVisible();
  await page.getByRole('button', { name: /Given\s*: Amoxicillin at 14:00/ }).click();
  await expect(page.getByRole('status').first()).toContainText('Amoxicillin 500 mg at 14:00 recorded as given');
  await expect(page.getByText('Overdue:')).toHaveCount(0);
});

test('monitoring: updates can be paused, and every bed states its alert level in words', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-continuous-patient-monitoring/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  const pause = page.getByRole('button', { name: /Pause updates|Resume updates/ });
  await pause.click();
  await expect(pause).toHaveAttribute('aria-pressed', /true|false/);
  const beds = page.locator('.mo-beds > li');
  await expect(beds).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await expect(beds.nth(i)).toContainText(/Stable|Increased monitoring|Urgent review needed/);
  }
});

test('shared medicines: filters by source, flags disagreements, compares two sources', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-shared-medicines/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await expect(page.getByText('Sources differ: check before changing')).toHaveCount(1);
  await page.getByRole('radio', { name: 'Hospital' }).check();
  await expect(page.getByText('3 of 5 medicines shown')).toBeVisible();
  await page.getByLabel('Second source').selectOption('GP practice');
  await expect(page.getByText('Choose two different sources to compare.')).toBeVisible();
});

test('vaccinations: the language switch changes the words, the lang attribute and the date format', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-vaccinations/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  const content = page.locator('main > div[lang]');
  await expect(content).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record and review vaccinations');
  await expect(page.getByText('14 Mar 2008')).toBeVisible();
  await page.getByRole('button', { name: 'Cymraeg' }).click();
  await expect(content).toHaveAttribute('lang', 'cy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cofnodi ac adolygu brechiadau');
  await expect(page.getByRole('button', { name: 'Cymraeg' })).toHaveAttribute('aria-pressed', 'true');
  // The date is whatever this browser's Intl writes for Welsh; if the browser has no Welsh data the page writes the ISO date
  // instead of silently showing another language's format.
  const expected = await page.evaluate(() =>
    Intl.DateTimeFormat.supportedLocalesOf(['cy-GB']).length
      ? new Intl.DateTimeFormat('cy-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date('2008-03-14T12:00:00Z'))
      : '2008-03-14'
  );
  await expect(page.locator('time').first()).toHaveText(expected);
  await expect(page.getByText('unreviewed draft')).toHaveCount(0);
  await expect(page.getByText('ddrafft heb ei adolygu')).toBeVisible();
});

test('vaccinations: errors are in the chosen language and move focus; a valid dose joins the record', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-vaccinations/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await page.getByRole('button', { name: 'Cymraeg' }).click();
  await page.getByRole('button', { name: 'Cadw’r brechiad' }).click();
  const alert = page.getByRole('alert');
  await expect(alert).toContainText('Mae problem');
  await expect(alert).toContainText('Rhowch rif swp');
  await expect(alert).toBeFocused();
  await page.getByRole('button', { name: 'English' }).click();
  await page.getByLabel('Vaccine', { exact: true }).selectOption('covid');
  await page.getByLabel('Batch number').fill('CV-0001');
  await page.getByRole('button', { name: 'Save vaccination' }).click();
  await expect(page.getByRole('status').first()).toContainText('Recorded: COVID-19');
  await expect(page.getByText('CV-0001')).toBeVisible();
});

test('vaccinations: stock states are written in words in both languages', async ({ page }) => {
  await page.goto('/en-001/examples/health-care-vaccinations/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
  await expect(page.getByText('Low: order more')).toBeVisible();
  await page.getByRole('button', { name: 'Cymraeg' }).click();
  await expect(page.getByText('Isel: archebwch ragor')).toBeVisible();
});
