// romania-pasaport-input.test.js
// RomaniaPasaportInput component test

const path = require('path');

describe('RomaniaPasaportInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'romania-pasaport-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.romania-pasaport-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('romania-pasaport-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.romania-pasaport-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.romania-pasaport-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
