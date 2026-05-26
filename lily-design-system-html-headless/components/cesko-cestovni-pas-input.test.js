// cesko-cestovni-pas-input.test.js
// CeskoCestovniPasInput component test

const path = require('path');

describe('CeskoCestovniPasInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'cesko-cestovni-pas-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.cesko-cestovni-pas-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('cesko-cestovni-pas-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.cesko-cestovni-pas-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.cesko-cestovni-pas-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
