// slovenija-emso-input.test.js
// SlovenijaEmsoInput component test

const path = require('path');

describe('SlovenijaEmsoInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'slovenija-emso-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.slovenija-emso-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('slovenija-emso-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.slovenija-emso-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.slovenija-emso-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
