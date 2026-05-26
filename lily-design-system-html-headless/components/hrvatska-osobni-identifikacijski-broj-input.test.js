// hrvatska-osobni-identifikacijski-broj-input.test.js
// HrvatskaOsobniIdentifikacijskiBrojInput component test

const path = require('path');

describe('HrvatskaOsobniIdentifikacijskiBrojInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'hrvatska-osobni-identifikacijski-broj-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.hrvatska-osobni-identifikacijski-broj-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('hrvatska-osobni-identifikacijski-broj-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.hrvatska-osobni-identifikacijski-broj-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.hrvatska-osobni-identifikacijski-broj-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
