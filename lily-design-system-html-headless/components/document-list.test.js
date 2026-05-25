// document-list.test.js
// DocumentList component test

const path = require('path');

describe('DocumentList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'document-list.html'));
  });

  it('should render the ul element with correct class', async function() {
    const el = await $('ul.document-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('document-list');
  });
});
