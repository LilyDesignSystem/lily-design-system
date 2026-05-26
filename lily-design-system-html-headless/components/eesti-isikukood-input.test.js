// eesti-isikukood-input.test.js
// EestiIsikukoodInput component test

const path = require('path');

describe('EestiIsikukoodInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'eesti-isikukood-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.eesti-isikukood-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('eesti-isikukood-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.eesti-isikukood-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.eesti-isikukood-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
