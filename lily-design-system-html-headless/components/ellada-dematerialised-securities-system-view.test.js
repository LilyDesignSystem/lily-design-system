// ellada-dematerialised-securities-system-view.test.js
// ElladaDematerialisedSecuritiesSystemView component test

const path = require('path');

describe('ElladaDematerialisedSecuritiesSystemView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'ellada-dematerialised-securities-system-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.ellada-dematerialised-securities-system-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('ellada-dematerialised-securities-system-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.ellada-dematerialised-securities-system-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
