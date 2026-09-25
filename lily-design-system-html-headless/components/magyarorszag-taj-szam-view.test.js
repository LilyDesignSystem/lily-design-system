// magyarorszag-taj-szam-view.test.js
// MagyarorszagTajSzamView component test

const path = require('path');

describe('MagyarorszagTajSzamView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'magyarorszag-taj-szam-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.magyarorszag-taj-szam-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('magyarorszag-taj-szam-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.magyarorszag-taj-szam-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
