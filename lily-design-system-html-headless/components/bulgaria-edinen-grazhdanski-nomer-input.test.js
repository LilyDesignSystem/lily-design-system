// bulgaria-edinen-grazhdanski-nomer-input.test.js
// BulgariaEdinenGrazhdanskiNomerInput component test

const path = require('path');

describe('BulgariaEdinenGrazhdanskiNomerInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'bulgaria-edinen-grazhdanski-nomer-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.bulgaria-edinen-grazhdanski-nomer-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('bulgaria-edinen-grazhdanski-nomer-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.bulgaria-edinen-grazhdanski-nomer-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.bulgaria-edinen-grazhdanski-nomer-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
