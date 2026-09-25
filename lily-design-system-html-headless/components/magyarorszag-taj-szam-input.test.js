// magyarorszag-taj-szam-input.test.js
// MagyarorszagTajSzamInput component test

const path = require('path');

describe('MagyarorszagTajSzamInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'magyarorszag-taj-szam-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.magyarorszag-taj-szam-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('magyarorszag-taj-szam-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.magyarorszag-taj-szam-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.magyarorszag-taj-szam-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
