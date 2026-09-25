// misr-al-raqm-al-qawmi-input.test.js
// MisrAlRaqmAlQawmiInput component test

const path = require('path');

describe('MisrAlRaqmAlQawmiInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'misr-al-raqm-al-qawmi-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.misr-al-raqm-al-qawmi-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('misr-al-raqm-al-qawmi-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.misr-al-raqm-al-qawmi-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.misr-al-raqm-al-qawmi-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
