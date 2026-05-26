// slovensko-pas-view.test.js
// SlovenskoPasView component test

const path = require('path');

describe('SlovenskoPasView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'slovensko-pas-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.slovensko-pas-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('slovensko-pas-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.slovensko-pas-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
