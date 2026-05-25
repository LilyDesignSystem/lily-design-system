// medical-banner-box-for-advice.test.js
// MedicalBannerBoxForAdvice component test

const path = require('path');

describe('MedicalBannerBoxForAdvice', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'medical-banner-box-for-advice.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.medical-banner-box-for-advice');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('medical-banner-box-for-advice');
  });
});
