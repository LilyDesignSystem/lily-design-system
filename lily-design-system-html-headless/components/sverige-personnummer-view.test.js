// sverige-personnummer-view.test.js
// SverigePersonnummerView component test

const path = require('path');

describe('SverigePersonnummerView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'sverige-personnummer-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.sverige-personnummer-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('sverige-personnummer-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.sverige-personnummer-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
