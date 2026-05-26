// belgique-numero-de-registre-national-input.test.js
// BelgiqueNumeroDeRegistreNationalInput component test

const path = require('path');

describe('BelgiqueNumeroDeRegistreNationalInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'belgique-numero-de-registre-national-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.belgique-numero-de-registre-national-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('belgique-numero-de-registre-national-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.belgique-numero-de-registre-national-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.belgique-numero-de-registre-national-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
