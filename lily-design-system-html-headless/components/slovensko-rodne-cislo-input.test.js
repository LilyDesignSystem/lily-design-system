// slovensko-rodne-cislo-input.test.js
// SlovenskoRodneCisloInput component test

const path = require('path');

describe('SlovenskoRodneCisloInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'slovensko-rodne-cislo-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.slovensko-rodne-cislo-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('slovensko-rodne-cislo-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.slovensko-rodne-cislo-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.slovensko-rodne-cislo-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
