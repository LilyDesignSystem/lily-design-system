// menu-group.test.js
// MenuGroup component test

const path = require('path');

describe('MenuGroup', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'menu-group.html'));
  });

  it('should render the group element with correct class', async function() {
    const el = await $('div.menu-group');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('menu-group');
  });

  it('should have role="group"', async function() {
    const el = await $('div.menu-group');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.menu-group');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should render a heading with aria-hidden="true"', async function() {
    const heading = await $('div.menu-group > div.menu-group-heading');
    await expect(heading).toExist();
    expect(await heading.getAttribute('aria-hidden')).toBe('true');
  });
});
