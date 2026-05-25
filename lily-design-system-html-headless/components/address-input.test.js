// address-input.test.js
// AddressInput component test

const path = require('path');

describe('AddressInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'address-input.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.address-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('address-input');
  });
});
