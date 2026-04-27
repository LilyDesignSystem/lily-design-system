// collection-list-item.test.js
// CollectionListItem component test

const path = require('path');

describe('CollectionListItem', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'collection-list-item.html'));
  });

  it('should render the li element with correct class', async function() {
    const el = await $('li.collection-list-item');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('collection-list-item');
  });

  it('should be an <li> element', async function() {
    const el = await $('li.collection-list-item');
    const tag = await el.getTagName();
    expect(tag).toBe('li');
  });

  it('should contain a heading element', async function() {
    const heading = await $('li.collection-list-item h3.collection-list-item-heading');
    await expect(heading).toExist();
  });
});
