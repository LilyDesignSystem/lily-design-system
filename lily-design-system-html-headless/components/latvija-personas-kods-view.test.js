// latvija-personas-kods-view.test.js
// LatvijaPersonasKodsView component test

const path = require('path');

describe('LatvijaPersonasKodsView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'latvija-personas-kods-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.latvija-personas-kods-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('latvija-personas-kods-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.latvija-personas-kods-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
