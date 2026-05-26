// cesko-rodne-cislo-input.test.js
// CeskoRodneCisloInput component test

const path = require('path');

describe('CeskoRodneCisloInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'cesko-rodne-cislo-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.cesko-rodne-cislo-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('cesko-rodne-cislo-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.cesko-rodne-cislo-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.cesko-rodne-cislo-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
