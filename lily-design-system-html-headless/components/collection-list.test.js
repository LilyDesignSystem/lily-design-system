// collection-list.test.js
// CollectionList component test

const path = require('path');

describe('CollectionList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'collection-list.html'));
  });

  it('should render the ul element with correct class', async function() {
    const el = await $('ul.collection-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('collection-list');
  });

  it('should be a <ul> element with list semantics', async function() {
    const el = await $('ul.collection-list');
    const tag = await el.getTagName();
    expect(tag).toBe('ul');
  });

  it('should have an aria-label attribute (optional)', async function() {
    const el = await $('ul.collection-list');
    const label = await el.getAttribute('aria-label');
    // aria-label is optional but should be present (possibly empty) so consumers can fill it
    expect(label).not.toBeNull();
  });
});
