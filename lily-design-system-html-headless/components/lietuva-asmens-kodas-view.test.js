// lietuva-asmens-kodas-view.test.js
// LietuvaAsmensKodasView component test

const path = require('path');

describe('LietuvaAsmensKodasView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'lietuva-asmens-kodas-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.lietuva-asmens-kodas-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('lietuva-asmens-kodas-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.lietuva-asmens-kodas-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
