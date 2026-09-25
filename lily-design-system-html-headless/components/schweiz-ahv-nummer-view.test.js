// schweiz-ahv-nummer-view.test.js
// SchweizAhvNummerView component test

const path = require('path');

describe('SchweizAhvNummerView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'schweiz-ahv-nummer-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.schweiz-ahv-nummer-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('schweiz-ahv-nummer-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.schweiz-ahv-nummer-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
