// norge-fodselsnummer-view.test.js
// NorgeFodselsnummerView component test

const path = require('path');

describe('NorgeFodselsnummerView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'norge-fodselsnummer-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.norge-fodselsnummer-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('norge-fodselsnummer-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.norge-fodselsnummer-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
