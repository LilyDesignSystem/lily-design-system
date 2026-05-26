// polska-pesel-view.test.js
// PolskaPeselView component test

const path = require('path');

describe('PolskaPeselView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'polska-pesel-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.polska-pesel-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('polska-pesel-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.polska-pesel-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
