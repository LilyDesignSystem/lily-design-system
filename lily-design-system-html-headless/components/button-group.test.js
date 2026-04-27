// button-group.test.js
// ButtonGroup component test

const path = require('path');

describe('ButtonGroup', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'button-group.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.button-group');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('button-group');
  });

  it('should have role="group"', async function() {
    const el = await $('div.button-group');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.button-group');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
