// ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view.test.js
// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView component test

const path = require('path');

describe('UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
