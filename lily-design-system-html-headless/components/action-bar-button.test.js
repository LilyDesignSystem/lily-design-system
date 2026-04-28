// action-bar-button.test.js
// ActionBarButton component test

const path = require('path');

describe('ActionBarButton', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'action-bar-button.html'));
  });

  it('should render a button element with correct class', async function() {
    const el = await $('button.action-bar-button');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('action-bar-button');
  });

  it('should default to type="button"', async function() {
    const el = await $('button.action-bar-button');
    const type = await el.getAttribute('type');
    expect(type).toBe('button');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('button.action-bar-button');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should be activatable via click', async function() {
    const el = await $('button.action-bar-button');
    await el.click();
    await expect(el).toExist();
  });
});
