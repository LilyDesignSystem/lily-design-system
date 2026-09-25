// schweiz-ahv-nummer-input.test.js
// SchweizAhvNummerInput component test

const path = require('path');

describe('SchweizAhvNummerInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'schweiz-ahv-nummer-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.schweiz-ahv-nummer-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('schweiz-ahv-nummer-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.schweiz-ahv-nummer-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.schweiz-ahv-nummer-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
