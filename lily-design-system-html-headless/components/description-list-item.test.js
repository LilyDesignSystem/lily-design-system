// description-list-item.test.js
// DescriptionListItem component test

const path = require('path');

describe('DescriptionListItem', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'description-list-item.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.description-list-item');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('description-list-item');
  });
});
