// england-national-health-service-number-view.test.js
// EnglandNationalHealthServiceNumberView component test

const path = require('path');

describe('EnglandNationalHealthServiceNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'england-national-health-service-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.england-national-health-service-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('england-national-health-service-number-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.england-national-health-service-number-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
