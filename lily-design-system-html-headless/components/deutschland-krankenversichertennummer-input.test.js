// deutschland-krankenversichertennummer-input.test.js
// DeutschlandKrankenversichertennummerInput component test

const path = require('path');

describe('DeutschlandKrankenversichertennummerInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'deutschland-krankenversichertennummer-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.deutschland-krankenversichertennummer-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('deutschland-krankenversichertennummer-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.deutschland-krankenversichertennummer-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.deutschland-krankenversichertennummer-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
