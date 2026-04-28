// newsletter-signup.test.js
// NewsletterSignup component test

const path = require('path');

describe('NewsletterSignup', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'newsletter-signup.html'));
  });

  it('should render the form element with correct class', async function() {
    const el = await $('form.newsletter-signup');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('newsletter-signup');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('form.newsletter-signup');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should default to data-state="idle"', async function() {
    const el = await $('form.newsletter-signup');
    const state = await el.getAttribute('data-state');
    expect(state).toBe('idle');
  });

  it('should contain an email input and submit button', async function() {
    const email = await $('form.newsletter-signup input.newsletter-signup-email');
    await expect(email).toExist();
    const type = await email.getAttribute('type');
    expect(type).toBe('email');

    const submit = await $('form.newsletter-signup button.newsletter-signup-submit');
    await expect(submit).toExist();
    const submitType = await submit.getAttribute('type');
    expect(submitType).toBe('submit');
  });

  it('should hide success and error messages by default', async function() {
    const success = await $('form.newsletter-signup .newsletter-signup-success');
    const error = await $('form.newsletter-signup .newsletter-signup-error');
    expect(await success.getAttribute('hidden')).not.toBeNull();
    expect(await error.getAttribute('hidden')).not.toBeNull();
  });

  it('should use role="status" for the success message and role="alert" for the error message', async function() {
    const success = await $('form.newsletter-signup .newsletter-signup-success');
    const error = await $('form.newsletter-signup .newsletter-signup-error');
    expect(await success.getAttribute('role')).toBe('status');
    expect(await success.getAttribute('aria-live')).toBe('polite');
    expect(await error.getAttribute('role')).toBe('alert');
  });

  it('should show the success message when data-state is set to "success"', async function() {
    await browser.execute(function() {
      document.querySelector('form.newsletter-signup').setAttribute('data-state', 'success');
    });
    // Allow MutationObserver microtask to run.
    await browser.pause(50);
    const success = await $('form.newsletter-signup .newsletter-signup-success');
    expect(await success.getAttribute('hidden')).toBeNull();
    const error = await $('form.newsletter-signup .newsletter-signup-error');
    expect(await error.getAttribute('hidden')).not.toBeNull();
  });

  it('should show the error message when data-state is set to "error"', async function() {
    await browser.execute(function() {
      document.querySelector('form.newsletter-signup').setAttribute('data-state', 'error');
    });
    await browser.pause(50);
    const error = await $('form.newsletter-signup .newsletter-signup-error');
    expect(await error.getAttribute('hidden')).toBeNull();
    const success = await $('form.newsletter-signup .newsletter-signup-success');
    expect(await success.getAttribute('hidden')).not.toBeNull();
  });

  it('should disable the email input and submit button when data-state is set to "submitting"', async function() {
    await browser.execute(function() {
      document.querySelector('form.newsletter-signup').setAttribute('data-state', 'submitting');
    });
    await browser.pause(50);
    const email = await $('form.newsletter-signup input.newsletter-signup-email');
    const submit = await $('form.newsletter-signup button.newsletter-signup-submit');
    expect(await email.isEnabled()).toBe(false);
    expect(await submit.isEnabled()).toBe(false);
  });
});
