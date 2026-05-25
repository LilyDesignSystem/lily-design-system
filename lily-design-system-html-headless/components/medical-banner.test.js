// medical-banner.test.js
// MedicalBanner component test

const path = require('path');

describe('MedicalBanner', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'medical-banner.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.medical-banner');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('medical-banner');
  });
});
