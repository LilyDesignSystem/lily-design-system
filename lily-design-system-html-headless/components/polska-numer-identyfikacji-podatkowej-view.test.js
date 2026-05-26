// polska-numer-identyfikacji-podatkowej-view.test.js
// PolskaNumerIdentyfikacjiPodatkowejView component test

const path = require('path');

describe('PolskaNumerIdentyfikacjiPodatkowejView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'polska-numer-identyfikacji-podatkowej-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.polska-numer-identyfikacji-podatkowej-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('polska-numer-identyfikacji-podatkowej-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.polska-numer-identyfikacji-podatkowej-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
