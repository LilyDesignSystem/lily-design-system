// phase-banner.test.js
// PhaseBanner component test

const path = require('path');

describe('PhaseBanner', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'phase-banner.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.phase-banner');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('phase-banner');
  });
});
