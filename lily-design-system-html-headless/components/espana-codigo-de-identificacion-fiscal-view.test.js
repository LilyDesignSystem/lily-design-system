// espana-codigo-de-identificacion-fiscal-view.test.js
// EspanaCodigoDeIdentificacionFiscalView component test

const path = require('path');

describe('EspanaCodigoDeIdentificacionFiscalView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'espana-codigo-de-identificacion-fiscal-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.espana-codigo-de-identificacion-fiscal-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('espana-codigo-de-identificacion-fiscal-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.espana-codigo-de-identificacion-fiscal-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
