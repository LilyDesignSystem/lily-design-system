// slovensko-rodne-cislo-view.test.js
// SlovenskoRodneCisloView component test

const path = require('path');

describe('SlovenskoRodneCisloView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'slovensko-rodne-cislo-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.slovensko-rodne-cislo-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('slovensko-rodne-cislo-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.slovensko-rodne-cislo-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
