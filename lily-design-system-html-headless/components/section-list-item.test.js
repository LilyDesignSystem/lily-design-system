// section-list-item.test.js
// SectionListItem component test

const path = require('path');

describe('SectionListItem', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'section-list-item.html'));
  });

  it('should render the li element with correct class', async function() {
    const el = await $('li.section-list-item');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('section-list-item');
  });
});
