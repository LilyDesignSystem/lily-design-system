// icon-list-item.test.js
// IconListItem component test

const path = require('path');

describe('IconListItem', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'icon-list-item.html'));
  });

  it('should render the li element with correct class', async function() {
    const el = await $('li.icon-list-item');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('icon-list-item');
  });

  it('should be an <li> element', async function() {
    const el = await $('li.icon-list-item');
    const tag = await el.getTagName();
    expect(tag).toBe('li');
  });

  it('should contain a decorative icon span with aria-hidden="true"', async function() {
    const icon = await $('li.icon-list-item span.icon-list-item-icon');
    await expect(icon).toExist();
    const hidden = await icon.getAttribute('aria-hidden');
    expect(hidden).toBe('true');
  });

  it('should contain a text span', async function() {
    const text = await $('li.icon-list-item span.icon-list-item-text');
    await expect(text).toExist();
  });
});
