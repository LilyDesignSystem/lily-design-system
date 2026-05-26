// malta-national-identification-number-view.test.js
// MaltaNationalIdentificationNumberView component test

const path = require('path');

describe('MaltaNationalIdentificationNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'malta-national-identification-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.malta-national-identification-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('malta-national-identification-number-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.malta-national-identification-number-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
