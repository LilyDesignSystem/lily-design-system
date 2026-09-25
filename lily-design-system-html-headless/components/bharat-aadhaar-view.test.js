// bharat-aadhaar-view.test.js
// BharatAadhaarView component test

const path = require('path');

describe('BharatAadhaarView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'bharat-aadhaar-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.bharat-aadhaar-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('bharat-aadhaar-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.bharat-aadhaar-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
