// singapore-national-registration-identity-card-input.test.js
// SingaporeNationalRegistrationIdentityCardInput component test

const path = require('path');

describe('SingaporeNationalRegistrationIdentityCardInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'singapore-national-registration-identity-card-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.singapore-national-registration-identity-card-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('singapore-national-registration-identity-card-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.singapore-national-registration-identity-card-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.singapore-national-registration-identity-card-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
