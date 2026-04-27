// validation-list-item.test.js
// ValidationListItem component test

const path = require('path');

describe('ValidationListItem', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'validation-list-item.html'));
  });

  it('should render the li element with correct class', async function() {
    const el = await $('li.validation-list-item');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('validation-list-item');
  });

  it('should be an <li> element', async function() {
    const el = await $('li.validation-list-item');
    const tag = await el.getTagName();
    expect(tag).toBe('li');
  });

  it('should expose status via data-status', async function() {
    const el = await $('li.validation-list-item');
    const status = await el.getAttribute('data-status');
    expect(['pending', 'passed', 'failed']).toContain(status);
  });

  it('should have an aria-label attribute (optional override)', async function() {
    const el = await $('li.validation-list-item');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
