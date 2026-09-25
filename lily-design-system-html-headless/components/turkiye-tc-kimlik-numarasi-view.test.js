// turkiye-tc-kimlik-numarasi-view.test.js
// TurkiyeTcKimlikNumarasiView component test

const path = require('path');

describe('TurkiyeTcKimlikNumarasiView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'turkiye-tc-kimlik-numarasi-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.turkiye-tc-kimlik-numarasi-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('turkiye-tc-kimlik-numarasi-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.turkiye-tc-kimlik-numarasi-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
