// section-list.test.js
// SectionList component test

const path = require('path');

describe('SectionList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'section-list.html'));
  });

  it('should render the ul element with correct class', async function() {
    const el = await $('ul.section-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('section-list');
  });
});
