// brasil-cartao-nacional-de-saude-input.test.js
// BrasilCartaoNacionalDeSaudeInput component test

const path = require('path');

describe('BrasilCartaoNacionalDeSaudeInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'brasil-cartao-nacional-de-saude-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.brasil-cartao-nacional-de-saude-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('brasil-cartao-nacional-de-saude-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.brasil-cartao-nacional-de-saude-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.brasil-cartao-nacional-de-saude-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
