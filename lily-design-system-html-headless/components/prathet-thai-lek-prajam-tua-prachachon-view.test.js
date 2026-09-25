// prathet-thai-lek-prajam-tua-prachachon-view.test.js
// PrathetThaiLekPrajamTuaPrachachonView component test

const path = require('path');

describe('PrathetThaiLekPrajamTuaPrachachonView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'prathet-thai-lek-prajam-tua-prachachon-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.prathet-thai-lek-prajam-tua-prachachon-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('prathet-thai-lek-prajam-tua-prachachon-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.prathet-thai-lek-prajam-tua-prachachon-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
