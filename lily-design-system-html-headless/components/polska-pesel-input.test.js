// polska-pesel-input.test.js
// PolskaPeselInput component test

const path = require('path');

describe('PolskaPeselInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'polska-pesel-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.polska-pesel-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('polska-pesel-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.polska-pesel-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.polska-pesel-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
