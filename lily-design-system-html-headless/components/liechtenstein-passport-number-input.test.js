// liechtenstein-passport-number-input.test.js
// LiechtensteinPassportNumberInput component test

const path = require('path');

describe('LiechtensteinPassportNumberInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'liechtenstein-passport-number-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.liechtenstein-passport-number-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('liechtenstein-passport-number-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.liechtenstein-passport-number-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.liechtenstein-passport-number-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
