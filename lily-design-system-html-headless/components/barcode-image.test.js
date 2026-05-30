// barcode-image.test.js
// BarcodeImage component test

const path = require('path');

describe('BarcodeImage', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'barcode-image.html'));
  });

  it('should render the img element with correct class', async function() {
    const el = await $('img.barcode-image');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('barcode-image');
  });

  it('should have an alt attribute', async function() {
    const el = await $('img.barcode-image');
    const alt = await el.getAttribute('alt');
    expect(alt).not.toBeNull();
  });
});
