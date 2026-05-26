// nederland-paspoort-nummer-view.test.js
// NederlandPaspoortNummerView component test

const path = require('path');

describe('NederlandPaspoortNummerView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'nederland-paspoort-nummer-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.nederland-paspoort-nummer-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('nederland-paspoort-nummer-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.nederland-paspoort-nummer-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
