// argentina-codigo-unico-de-identificacion-laboral-view.test.js
// ArgentinaCodigoUnicoDeIdentificacionLaboralView component test

const path = require('path');

describe('ArgentinaCodigoUnicoDeIdentificacionLaboralView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'argentina-codigo-unico-de-identificacion-laboral-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.argentina-codigo-unico-de-identificacion-laboral-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('argentina-codigo-unico-de-identificacion-laboral-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.argentina-codigo-unico-de-identificacion-laboral-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
