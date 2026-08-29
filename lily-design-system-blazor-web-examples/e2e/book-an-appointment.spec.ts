import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Plan P6-T3: the "book an appointment" flagship composed-page pattern,
// ported from the canonical SvelteKit reference
// (lily-design-system-svelte-sveltekit-examples/e2e/book-an-appointment.spec.ts)
// to this app's Blazor Interactive Server route. Full write-up:
// docs/patterns/book-an-appointment.md.
//
// Blazor Interactive Server renders the initial markup before the SignalR
// circuit connects, so an interaction fired the instant `page.goto()`
// resolves can be lost (the click reaches the DOM, but there is no live
// circuit yet to carry the event to the server). `readyForInteraction`
// waits for that circuit before the test starts clicking — this class of
// wait has no equivalent in the SvelteKit reference, which hydrates
// synchronously with the page.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  if (results.violations.length > 0) {
    const summary = results.violations
      .map(v => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
      .join('\n');
    throw new Error(`axe found ${results.violations.length} WCAG violations on ${label}:\n${summary}`);
  }
}

async function gotoReady(page: Page) {
  await page.goto('/book-an-appointment');
  await page.waitForFunction(() => (window as unknown as { Blazor?: unknown }).Blazor !== undefined);
  // The circuit finishes connecting shortly after Blazor.start(); give it
  // a beat so the very first click isn't lost between page load and the
  // SignalR handshake completing.
  await page.waitForTimeout(300);
}

test.describe('book an appointment: happy path', () => {
  test('reason -> date and time -> your details -> check answers -> confirmation', async ({ page }) => {
    await gotoReady(page);
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
    await gotoReady(page);
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    const summary = page.locator('#booking-error-summary');
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary).toContainText('Select a reason for your appointment');
    await expectNoViolations(page, 'step 1: reason (error state)');
  });

  test('reason step requires detail when "something else" is selected', async ({ page }) => {
    await gotoReady(page);
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Something else').check();
    await expect(page.locator('#reason-other-detail')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('#booking-error-summary')).toContainText(
      'Enter details about your appointment',
    );
  });

  test('date and time step rejects a past date', async ({ page }) => {
    await gotoReady(page);
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
    await gotoReady(page);
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
    await gotoReady(page);
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
    await gotoReady(page);
    await page.getByRole('button', { name: 'Start now' }).click();
    await page.getByLabel('Routine check-up').check();
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Reason for your appointment' })).toBeVisible();
    await expect(page.getByLabel('Routine check-up')).toBeChecked();
  });

  test('a "Change" link on check-your-answers jumps back to the right step', async ({ page }) => {
    await gotoReady(page);
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
    await gotoReady(page);
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
