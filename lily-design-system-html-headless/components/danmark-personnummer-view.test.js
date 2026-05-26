// danmark-personnummer-view.test.js
// DanmarkPersonnummerView component test

const path = require('path');

describe('DanmarkPersonnummerView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'danmark-personnummer-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.danmark-personnummer-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('danmark-personnummer-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.danmark-personnummer-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
