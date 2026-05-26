// romania-cod-numeric-personal-input.test.js
// RomaniaCodNumericPersonalInput component test

const path = require('path');

describe('RomaniaCodNumericPersonalInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'romania-cod-numeric-personal-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.romania-cod-numeric-personal-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('romania-cod-numeric-personal-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.romania-cod-numeric-personal-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.romania-cod-numeric-personal-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
