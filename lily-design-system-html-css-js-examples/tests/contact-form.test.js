// contact-form.test.js
// Contact Form page test

const path = require('path');

describe('Contact Form', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'contact-form.html'));
  });

  it('should render the form with correct class and aria-label', async function() {
    const el = await $('form.form');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Contact us');
  });

  it('should render all form fields', async function() {
    const fields = await $$('div.field');
    expect(fields.length).toBe(4);
  });

  it('should render the text input for name', async function() {
    const el = await $('input.text-input#name');
    await expect(el).toExist();
    const type = await el.getAttribute('type');
    expect(type).toBe('text');
  });

  it('should render the email input', async function() {
    const el = await $('input.email-input#email');
    await expect(el).toExist();
    const type = await el.getAttribute('type');
    expect(type).toBe('email');
  });

  it('should render the select dropdown', async function() {
    const el = await $('select.select#subject');
    await expect(el).toExist();
  });

  it('should render the textarea', async function() {
    const el = await $('textarea.textarea#message');
    await expect(el).toExist();
  });

  it('should render the submit button', async function() {
    const el = await $('button.button[type="submit"]');
    await expect(el).toExist();
  });

  it('should show error summary on invalid submit', async function() {
    const submitBtn = await $('button.button[type="submit"]');
    await submitBtn.click();
    const errorSummary = await $('div.error-summary');
    const hidden = await errorSummary.getAttribute('hidden');
    expect(hidden).toBeNull();
  });

  it('should show success message on valid submit', async function() {
    await $('input#name').setValue('John');
    await $('input#email').setValue('john@example.com');
    await $('textarea#message').setValue('Hello there');
    await $('button.button[type="submit"]').click();
    const success = await $('div#success-message');
    const hidden = await success.getAttribute('hidden');
    expect(hidden).toBeNull();
  });
});
