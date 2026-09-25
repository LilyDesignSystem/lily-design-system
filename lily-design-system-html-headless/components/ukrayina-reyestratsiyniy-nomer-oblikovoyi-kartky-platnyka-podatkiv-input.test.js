// ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input.test.js
// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput component test

const path = require('path');

describe('UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
