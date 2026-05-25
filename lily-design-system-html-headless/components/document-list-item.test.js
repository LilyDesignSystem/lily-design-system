// document-list-item.test.js
// DocumentListItem component test

const path = require('path');

describe('DocumentListItem', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'document-list-item.html'));
  });

  it('should render the li element with correct class', async function() {
    const el = await $('li.document-list-item');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('document-list-item');
  });
});
