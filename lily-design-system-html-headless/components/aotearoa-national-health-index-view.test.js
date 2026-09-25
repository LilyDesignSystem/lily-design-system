// aotearoa-national-health-index-view.test.js
// AotearoaNationalHealthIndexView component test

const path = require('path');

describe('AotearoaNationalHealthIndexView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'aotearoa-national-health-index-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.aotearoa-national-health-index-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('aotearoa-national-health-index-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.aotearoa-national-health-index-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
