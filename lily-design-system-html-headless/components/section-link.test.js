// section-link.test.js
// SectionLink component test

const path = require('path');

describe('SectionLink', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'section-link.html'));
  });

  it('should render the a element with correct class', async function() {
    const el = await $('a.section-link');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('section-link');
  });
});
