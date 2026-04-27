// icon-button.test.js
// IconButton component test

const path = require('path');

describe('IconButton', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'icon-button.html'));
  });

  it('should render the button element with correct class', async function() {
    const el = await $('button.icon-button');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('icon-button');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('button.icon-button');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should default to type="button"', async function() {
    const el = await $('button.icon-button');
    const type = await el.getAttribute('type');
    expect(type).toBe('button');
  });

  it('should be activatable via click', async function() {
    const el = await $('button.icon-button');
    await el.click();
    // Clicking should not throw; if aria-pressed is set, it would toggle.
    await expect(el).toExist();
  });
});
