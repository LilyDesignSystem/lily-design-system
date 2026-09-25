// rossiya-snils-view.test.js
// RossiyaSnilsView component test

const path = require('path');

describe('RossiyaSnilsView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'rossiya-snils-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.rossiya-snils-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('rossiya-snils-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.rossiya-snils-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
