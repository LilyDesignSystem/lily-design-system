// qr-code-image.test.js
// QrCodeImage component test

const path = require('path');

describe('QrCodeImage', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'qr-code-image.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.qr-code-image');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('qr-code-image');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.qr-code-image');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
