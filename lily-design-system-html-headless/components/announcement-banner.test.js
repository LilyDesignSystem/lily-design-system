// announcement-banner.test.js
// AnnouncementBanner component test

const path = require('path');

describe('AnnouncementBanner', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'announcement-banner.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.announcement-banner');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('announcement-banner');
  });
});
