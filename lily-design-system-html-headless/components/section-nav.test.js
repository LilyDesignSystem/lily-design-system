// section-nav.test.js
// SectionNav component test

const path = require('path');

describe('SectionNav', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'section-nav.html'));
  });

  it('should render the nav element with correct class', async function() {
    const el = await $('nav.section-nav');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('section-nav');
  });
});
