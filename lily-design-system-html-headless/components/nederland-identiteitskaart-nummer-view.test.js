// nederland-identiteitskaart-nummer-view.test.js
// NederlandIdentiteitskaartNummerView component test

const path = require('path');

describe('NederlandIdentiteitskaartNummerView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'nederland-identiteitskaart-nummer-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.nederland-identiteitskaart-nummer-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('nederland-identiteitskaart-nummer-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.nederland-identiteitskaart-nummer-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
