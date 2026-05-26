// polska-numer-identyfikacji-podatkowej-input.test.js
// PolskaNumerIdentyfikacjiPodatkowejInput component test

const path = require('path');

describe('PolskaNumerIdentyfikacjiPodatkowejInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'polska-numer-identyfikacji-podatkowej-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.polska-numer-identyfikacji-podatkowej-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('polska-numer-identyfikacji-podatkowej-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.polska-numer-identyfikacji-podatkowej-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.polska-numer-identyfikacji-podatkowej-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
