// banner-box.test.js
// BannerBox component test

const path = require('path');

describe('BannerBox', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'banner-box.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.banner-box');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('banner-box');
  });
});
