// icon-list.test.js
// IconList component test

const path = require('path');

describe('IconList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'icon-list.html'));
  });

  it('should render the ul element with correct class', async function() {
    const el = await $('ul.icon-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('icon-list');
  });

  it('should be a <ul> element', async function() {
    const el = await $('ul.icon-list');
    const tag = await el.getTagName();
    expect(tag).toBe('ul');
  });

  it('should have an aria-label attribute (optional)', async function() {
    const el = await $('ul.icon-list');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
