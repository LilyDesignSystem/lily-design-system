// south-africa-identity-number-view.test.js
// SouthAfricaIdentityNumberView component test

const path = require('path');

describe('SouthAfricaIdentityNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'south-africa-identity-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.south-africa-identity-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('south-africa-identity-number-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.south-africa-identity-number-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
