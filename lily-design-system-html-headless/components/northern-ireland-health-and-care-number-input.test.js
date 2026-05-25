// northern-ireland-health-and-care-number-input.test.js
// NorthernIrelandHealthAndCareNumberInput component test

const path = require('path');

describe('NorthernIrelandHealthAndCareNumberInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'northern-ireland-health-and-care-number-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.northern-ireland-health-and-care-number-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('northern-ireland-health-and-care-number-input');
  });
});
