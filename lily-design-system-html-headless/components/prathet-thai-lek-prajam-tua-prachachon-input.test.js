// prathet-thai-lek-prajam-tua-prachachon-input.test.js
// PrathetThaiLekPrajamTuaPrachachonInput component test

const path = require('path');

describe('PrathetThaiLekPrajamTuaPrachachonInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'prathet-thai-lek-prajam-tua-prachachon-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.prathet-thai-lek-prajam-tua-prachachon-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('prathet-thai-lek-prajam-tua-prachachon-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.prathet-thai-lek-prajam-tua-prachachon-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.prathet-thai-lek-prajam-tua-prachachon-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
