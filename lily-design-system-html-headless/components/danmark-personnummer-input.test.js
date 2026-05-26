// danmark-personnummer-input.test.js
// DanmarkPersonnummerInput component test

const path = require('path');

describe('DanmarkPersonnummerInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'danmark-personnummer-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.danmark-personnummer-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('danmark-personnummer-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.danmark-personnummer-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.danmark-personnummer-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
