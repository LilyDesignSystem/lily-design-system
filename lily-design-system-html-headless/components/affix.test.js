// affix.test.js
// Affix component test

const path = require('path');

describe('Affix', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'affix.html'));
  });

  it('should render a div element with the affix class', async function() {
    const el = await $('div.affix');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('affix');
  });

  it('should use position: sticky for pinning behavior', async function() {
    const el = await $('div.affix');
    const style = await el.getAttribute('style');
    expect(style).toContain('position: sticky');
  });

  it('should expose offset via data attribute', async function() {
    const el = await $('div.affix');
    const offsetTop = await el.getAttribute('data-offset-top');
    expect(offsetTop).not.toBeNull();
  });
});
