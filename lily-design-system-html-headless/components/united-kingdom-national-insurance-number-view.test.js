// united-kingdom-national-insurance-number-view.test.js
// UnitedKingdomNationalInsuranceNumberView component test

const path = require('path');

describe('UnitedKingdomNationalInsuranceNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'united-kingdom-national-insurance-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.united-kingdom-national-insurance-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('united-kingdom-national-insurance-number-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.united-kingdom-national-insurance-number-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
