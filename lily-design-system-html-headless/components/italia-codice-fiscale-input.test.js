// italia-codice-fiscale-input.test.js
// ItaliaCodiceFiscaleInput component test

const path = require('path');

describe('ItaliaCodiceFiscaleInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'italia-codice-fiscale-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.italia-codice-fiscale-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('italia-codice-fiscale-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.italia-codice-fiscale-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.italia-codice-fiscale-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
