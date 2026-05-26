// lietuva-asmens-kodas-input.test.js
// LietuvaAsmensKodasInput component test

const path = require('path');

describe('LietuvaAsmensKodasInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'lietuva-asmens-kodas-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.lietuva-asmens-kodas-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('lietuva-asmens-kodas-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.lietuva-asmens-kodas-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.lietuva-asmens-kodas-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
