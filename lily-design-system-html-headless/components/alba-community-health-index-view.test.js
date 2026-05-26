// alba-community-health-index-view.test.js
// AlbaCommunityHealthIndexView component test

const path = require('path');

describe('AlbaCommunityHealthIndexView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'alba-community-health-index-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.alba-community-health-index-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('alba-community-health-index-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.alba-community-health-index-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
