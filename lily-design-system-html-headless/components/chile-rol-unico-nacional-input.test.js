// chile-rol-unico-nacional-input.test.js
// ChileRolUnicoNacionalInput component test

const path = require('path');

describe('ChileRolUnicoNacionalInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'chile-rol-unico-nacional-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.chile-rol-unico-nacional-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('chile-rol-unico-nacional-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.chile-rol-unico-nacional-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.chile-rol-unico-nacional-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
