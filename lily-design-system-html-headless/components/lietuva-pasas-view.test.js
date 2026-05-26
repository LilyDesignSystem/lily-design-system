// lietuva-pasas-view.test.js
// LietuvaPasasView component test

const path = require('path');

describe('LietuvaPasasView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'lietuva-pasas-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.lietuva-pasas-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('lietuva-pasas-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.lietuva-pasas-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
