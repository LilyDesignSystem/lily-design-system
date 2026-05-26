// cesko-cestovni-pas-view.test.js
// CeskoCestovniPasView component test

const path = require('path');

describe('CeskoCestovniPasView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'cesko-cestovni-pas-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.cesko-cestovni-pas-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('cesko-cestovni-pas-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.cesko-cestovni-pas-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
