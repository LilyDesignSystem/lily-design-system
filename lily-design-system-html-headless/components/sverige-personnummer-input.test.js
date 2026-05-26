// sverige-personnummer-input.test.js
// SverigePersonnummerInput component test

const path = require('path');

describe('SverigePersonnummerInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'sverige-personnummer-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.sverige-personnummer-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('sverige-personnummer-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.sverige-personnummer-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.sverige-personnummer-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
