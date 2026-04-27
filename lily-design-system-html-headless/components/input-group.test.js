// input-group.test.js
// InputGroup component test

const path = require('path');

describe('InputGroup', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'input-group.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.input-group');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('input-group');
  });

  it('should have role="group"', async function() {
    const el = await $('div.input-group');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.input-group');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a prefix span', async function() {
    const prefix = await $('div.input-group span.input-group-prefix');
    await expect(prefix).toExist();
  });

  it('should contain a suffix span', async function() {
    const suffix = await $('div.input-group span.input-group-suffix');
    await expect(suffix).toExist();
  });
});
