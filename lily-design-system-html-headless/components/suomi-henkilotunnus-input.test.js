// suomi-henkilotunnus-input.test.js
// SuomiHenkilotunnusInput component test

const path = require('path');

describe('SuomiHenkilotunnusInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'suomi-henkilotunnus-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.suomi-henkilotunnus-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('suomi-henkilotunnus-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.suomi-henkilotunnus-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.suomi-henkilotunnus-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
