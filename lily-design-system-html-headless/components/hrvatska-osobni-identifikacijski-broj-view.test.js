// hrvatska-osobni-identifikacijski-broj-view.test.js
// HrvatskaOsobniIdentifikacijskiBrojView component test

const path = require('path');

describe('HrvatskaOsobniIdentifikacijskiBrojView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'hrvatska-osobni-identifikacijski-broj-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.hrvatska-osobni-identifikacijski-broj-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('hrvatska-osobni-identifikacijski-broj-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.hrvatska-osobni-identifikacijski-broj-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
