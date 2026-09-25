// yisrael-teudat-zehut-view.test.js
// YisraelTeudatZehutView component test

const path = require('path');

describe('YisraelTeudatZehutView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'yisrael-teudat-zehut-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.yisrael-teudat-zehut-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('yisrael-teudat-zehut-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.yisrael-teudat-zehut-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
