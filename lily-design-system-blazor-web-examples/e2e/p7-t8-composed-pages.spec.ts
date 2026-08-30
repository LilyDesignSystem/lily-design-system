import { test, expect, type Page } from '@playwright/test';

// P7-T8: ContactForm, SettingsPage, RatingAndFeedback, SearchAndFilter, and
// TaskManagement passed non-existent PascalCase component parameters
// (Value/ValueChanged/OnSubmit/Legend/Checked/CheckedChanged/Type/...) to
// headless components that only declare Label/CssClass/AdditionalAttributes
// (SwitchButton and, after this same fix, Combobox are the two genuine
// exceptions — see each component's .razor source). Those attributes were
// captured into AdditionalAttributes and splatted onto the root element
// verbatim, which does not wire real two-way binding or form submission.
// The pages were rewritten onto the native-attribute idiom BookAnAppointment
// already proved (lowercase `value`/`checked` + `@onchange`/`@oninput`/
// `@onsubmit`). These specs exercise the actual typing/selecting/submitting
// behaviour each page now performs, not just that the page loads.

async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => (window as unknown as { Blazor?: unknown }).Blazor !== undefined);
  await page.waitForTimeout(300);
}

test.describe('contact form', () => {
  test('fills the form and submits', async ({ page }) => {
    await gotoReady(page, '/contact-form');

    await page.locator('#name').fill('Ada Lovelace');
    await page.locator('#email').fill('ada@example.com');
    await page.locator('#subject').selectOption('support');
    await page.locator('#message').fill('The dashboard will not load.');
    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Thank you, Ada Lovelace!' })).toBeVisible();
  });

  test('shows validation errors when required fields are empty', async ({ page }) => {
    await gotoReady(page, '/contact-form');
    await page.getByRole('button', { name: 'Send Message' }).click();
    await expect(page.locator('.error-message', { hasText: 'Enter your full name' })).toBeVisible();
    await expect(page.locator('.error-message', { hasText: 'Enter a valid email address' })).toBeVisible();
    await expect(page.locator('.error-message', { hasText: 'Enter your message' })).toBeVisible();
  });
});

test.describe('settings page', () => {
  test('toggles switches, changes language, and picks a font size', async ({ page }) => {
    await gotoReady(page, '/settings-page');

    const darkMode = page.getByRole('switch', { name: 'Dark mode' });
    await expect(darkMode).toHaveAttribute('aria-checked', 'false');
    await darkMode.click();
    await expect(darkMode).toHaveAttribute('aria-checked', 'true');

    await page.locator('#language').selectOption('fr');
    await expect(page.locator('#language')).toHaveValue('fr');

    await page.locator('#font-size-large').check();
    await expect(page.locator('#font-size-large')).toBeChecked();
    await expect(page.locator('#font-size-small')).not.toBeChecked();

    await page.getByRole('button', { name: 'Save Settings' }).click();
    await expect(page.getByText('Settings saved successfully.')).toBeVisible();
  });
});

test.describe('rating and feedback', () => {
  test('picks ratings, writes a comment, and submits', async ({ page }) => {
    await gotoReady(page, '/rating-and-feedback');

    await page.locator('#stars-4').check();
    await page.locator('#satisfaction-5').check();
    await page.locator('#nps-9').check();
    await page.locator('#comment').fill('Great service overall.');
    await page.getByRole('button', { name: 'Submit Feedback' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Thank you!' })).toBeVisible();
    await expect(page.getByText('4 out of 5 stars')).toBeVisible();
  });
});

test.describe('search and filter', () => {
  test('filters the product table by search text', async ({ page }) => {
    await gotoReady(page, '/search-and-filter');

    await expect(page.getByRole('cell', { name: 'Wireless Keyboard' })).toBeVisible();
    await page.getByLabel('Search products').fill('Desk Lamp');
    await expect(page.getByRole('cell', { name: 'Desk Lamp' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Wireless Keyboard' })).toHaveCount(0);
  });

  test('filters by category via the combobox and adds a tag', async ({ page }) => {
    await gotoReady(page, '/search-and-filter');

    const combo = page.getByRole('combobox', { name: 'Filter by category' });
    await combo.fill('Electr');
    await page.getByRole('option', { name: 'Electronics' }).click();
    await expect(page.locator('.tag-group')).toContainText('Electronics');
    await expect(page.getByRole('cell', { name: 'Standing Desk' })).toHaveCount(0);

    const tagInput = page.getByLabel('Add filter tag');
    await tagInput.fill('Furniture');
    await tagInput.press('Enter');
    await expect(page.locator('.tag-group')).toContainText('Furniture');
  });
});

test.describe('task management', () => {
  test('adds a task and toggles completion', async ({ page }) => {
    await gotoReady(page, '/task-management');

    await page.getByLabel('New task').fill('Write release notes');
    await page.getByRole('button', { name: 'Add Task' }).click();
    const newItem = page.getByRole('checkbox', { name: 'Write release notes' });
    await expect(newItem).toBeVisible();
    await expect(newItem).not.toBeChecked();

    await newItem.check();
    await expect(newItem).toBeChecked();

    await page.getByLabel('Show completed tasks').uncheck();
    await expect(page.getByRole('checkbox', { name: 'Set up project repository' })).toHaveCount(0);
  });
});
