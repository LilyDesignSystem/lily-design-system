// liechtenstein-national-identity-card-number-view.test.js
// LiechtensteinNationalIdentityCardNumberView component test

const path = require('path');

describe('LiechtensteinNationalIdentityCardNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'liechtenstein-national-identity-card-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.liechtenstein-national-identity-card-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('liechtenstein-national-identity-card-number-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.liechtenstein-national-identity-card-number-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
