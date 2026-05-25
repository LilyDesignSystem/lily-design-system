// medical-banner-box.test.js
// MedicalBannerBox component test

const path = require('path');

describe('MedicalBannerBox', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'medical-banner-box.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.medical-banner-box');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('medical-banner-box');
  });
});
