import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Plan P6-T2: the "book an appointment" flagship composed-page pattern.
// A multi-step GP-appointment booking wizard exercising ~30 components.
// Full write-up: docs/patterns/book-an-appointment.md.
//
// This spec walks the entire flow end to end -- happy path, per-step
// validation, the "Change" links back from check-your-answers, and the
// "book another appointment" reset -- then scans every distinct state
// with axe. The generic composed-page sweeps in accessibility.spec.ts
// and responsive.spec.ts only ever see the flow's start screen; this
// file is what actually proves the later steps are clean.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoViolations(page: import('@playwright/test').Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  if (results.violations.length > 0) {
    const summary = results.violations
      .map(v => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
      .join('\n');
    throw new Error(`axe found ${results.violations.length} WCAG violations on ${label}:\n${summary}`);
  }
}

test.describe('book an appointment: happy path', () => {
  test('reason -> date and time -> your details -> check answers -> confirmation', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await expect(page.getByRole('heading', { level: 1, name: 'Book an appointment' })).toBeVisible();
    await expectNoViolations(page, 'before you start');

    await page.getByRole('button', { name: 'Start now' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Reason for your appointment' })).toBeFocused();
    await expectNoViolations(page, 'step 1: reason (empty)');

    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Choose a date and time' })).toBeFocused();
    await expectNoViolations(page, 'step 2: date and time (empty)');

    await page.locator('#appointment-date').fill('2027-01-15');
    await page.locator('#appointment-time').selectOption('morning');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Your details' })).toBeFocused();
    await expectNoViolations(page, 'step 3: your details (empty)');

    await page.locator('#full-name').fill('Ada Lovelace');
    await page.locator('#email').fill('ada@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Check your answers' })).toBeFocused();
    const summary = page.locator('.summary-list');
    await expect(summary).toContainText('Routine check-up');
    await expect(summary).toContainText('2027-01-15');
    await expect(summary).toContainText('Ada Lovelace');
    await expect(summary).toContainText('ada@example.com');
    await expect(summary).toContainText('Not provided'); // optional phone number
    await expectNoViolations(page, 'step 4: check your answers');

    await page.getByLabel('I confirm the information above is correct').check();
    await page.getByRole('button', { name: 'Confirm and book' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Booking confirmed' })).toBeFocused();
    await expect(page.getByText(/APT-\d{6}/)).toBeVisible();
    await expectNoViolations(page, 'step 5: confirmation');
  });
});

test.describe('book an appointment: per-step validation', () => {
  test('reason step blocks continuing with nothing selected', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    const summary = page.locator('#booking-error-summary');
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary).toContainText('Select a reason for your appointment');
    await expectNoViolations(page, 'step 1: reason (error state)');
  });

  test('reason step requires detail when "something else" is selected', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Something else').check();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('#booking-error-summary')).toContainText(
      'Enter details about your appointment',
    );
  });

  test('date and time step rejects a past date', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.locator('#appointment-date').fill('2020-01-01');
    await page.locator('#appointment-time').selectOption('morning');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('#booking-error-summary')).toContainText(
      'Enter a date that is today or in the future',
    );
  });

  test('your details step rejects a malformed email address', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('#appointment-date').fill('2027-01-15');
    await page.locator('#appointment-time').selectOption('morning');
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.locator('#full-name').fill('Ada Lovelace');
    await page.locator('#email').fill('not-an-email');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('#booking-error-summary')).toContainText(
      'Enter an email address in the correct format',
    );
  });

  test('check answers step requires the confirmation checkbox', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('#appointment-date').fill('2027-01-15');
    await page.locator('#appointment-time').selectOption('morning');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('#full-name').fill('Ada Lovelace');
    await page.locator('#email').fill('ada@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', { name: 'Confirm and book' }).click();
    await expect(page.locator('#booking-error-summary')).toContainText(
      'Confirm that the information above is correct',
    );
  });
});

test.describe('book an appointment: navigation', () => {
  test('Back buttons return to the previous step without losing answers', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Reason for your appointment' })).toBeVisible();
    await expect(page.getByLabel('Routine check-up')).toBeChecked();
  });

  test('a "Change" link on check-your-answers jumps back to the right step', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('#appointment-date').fill('2027-01-15');
    await page.locator('#appointment-time').selectOption('morning');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('#full-name').fill('Ada Lovelace');
    await page.locator('#email').fill('ada@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: /Change.*full name/i }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Your details' })).toBeVisible();
    await expect(page.locator('#full-name')).toHaveValue('Ada Lovelace');
  });

  test('"Book another appointment" resets the whole flow', async ({ page }) => {
    await page.goto('/book-an-appointment');
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('#appointment-date').fill('2027-01-15');
    await page.locator('#appointment-time').selectOption('morning');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('#full-name').fill('Ada Lovelace');
    await page.locator('#email').fill('ada@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('I confirm the information above is correct').check();
    await page.getByRole('button', { name: 'Confirm and book' }).click();

    await page.getByRole('button', { name: 'Book another appointment' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Before you start' })).toBeVisible();

    await page.getByRole('button', { name: 'Start now' }).click();
    await expect(page.getByLabel('Routine check-up')).not.toBeChecked();
  });
});
