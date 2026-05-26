// latvija-personas-kods-input.test.js
// LatvijaPersonasKodsInput component test

const path = require('path');

describe('LatvijaPersonasKodsInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'latvija-personas-kods-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.latvija-personas-kods-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('latvija-personas-kods-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.latvija-personas-kods-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.latvija-personas-kods-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
