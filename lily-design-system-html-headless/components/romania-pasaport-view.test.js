// romania-pasaport-view.test.js
// RomaniaPasaportView component test

const path = require('path');

describe('RomaniaPasaportView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'romania-pasaport-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.romania-pasaport-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('romania-pasaport-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.romania-pasaport-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
