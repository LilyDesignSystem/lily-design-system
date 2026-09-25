// mexico-clave-unica-de-registro-de-poblacion-input.test.js
// MexicoClaveUnicaDeRegistroDePoblacionInput component test

const path = require('path');

describe('MexicoClaveUnicaDeRegistroDePoblacionInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'mexico-clave-unica-de-registro-de-poblacion-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.mexico-clave-unica-de-registro-de-poblacion-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('mexico-clave-unica-de-registro-de-poblacion-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.mexico-clave-unica-de-registro-de-poblacion-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.mexico-clave-unica-de-registro-de-poblacion-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
