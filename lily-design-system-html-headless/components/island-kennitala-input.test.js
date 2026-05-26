// island-kennitala-input.test.js
// IslandKennitalaInput component test

const path = require('path');

describe('IslandKennitalaInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'island-kennitala-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.island-kennitala-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('island-kennitala-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.island-kennitala-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.island-kennitala-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
