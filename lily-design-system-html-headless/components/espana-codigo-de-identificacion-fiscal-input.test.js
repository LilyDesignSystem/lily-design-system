// espana-codigo-de-identificacion-fiscal-input.test.js
// EspanaCodigoDeIdentificacionFiscalInput component test

const path = require('path');

describe('EspanaCodigoDeIdentificacionFiscalInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'espana-codigo-de-identificacion-fiscal-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.espana-codigo-de-identificacion-fiscal-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('espana-codigo-de-identificacion-fiscal-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.espana-codigo-de-identificacion-fiscal-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.espana-codigo-de-identificacion-fiscal-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
