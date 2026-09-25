// chile-rol-unico-nacional-view.test.js
// ChileRolUnicoNacionalView component test

const path = require('path');

describe('ChileRolUnicoNacionalView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'chile-rol-unico-nacional-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.chile-rol-unico-nacional-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('chile-rol-unico-nacional-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.chile-rol-unico-nacional-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
