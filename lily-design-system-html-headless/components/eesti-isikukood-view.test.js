// eesti-isikukood-view.test.js
// EestiIsikukoodView component test

const path = require('path');

describe('EestiIsikukoodView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'eesti-isikukood-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.eesti-isikukood-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('eesti-isikukood-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.eesti-isikukood-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
