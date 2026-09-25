// rossiya-snils-input.test.js
// RossiyaSnilsInput component test

const path = require('path');

describe('RossiyaSnilsInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'rossiya-snils-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.rossiya-snils-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('rossiya-snils-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.rossiya-snils-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.rossiya-snils-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
