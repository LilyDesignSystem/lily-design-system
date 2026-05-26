// liechtenstein-passport-number-view.test.js
// LiechtensteinPassportNumberView component test

const path = require('path');

describe('LiechtensteinPassportNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'liechtenstein-passport-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.liechtenstein-passport-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('liechtenstein-passport-number-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.liechtenstein-passport-number-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
