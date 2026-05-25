// northern-ireland-health-and-care-number-view.test.js
// NorthernIrelandHealthAndCareNumberView component test

const path = require('path');

describe('NorthernIrelandHealthAndCareNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'northern-ireland-health-and-care-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.northern-ireland-health-and-care-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('northern-ireland-health-and-care-number-view');
  });
});
