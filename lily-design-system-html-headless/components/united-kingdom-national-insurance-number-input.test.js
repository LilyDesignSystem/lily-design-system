// united-kingdom-national-insurance-number-input.test.js
// UnitedKingdomNationalInsuranceNumberInput component test

const path = require('path');

describe('UnitedKingdomNationalInsuranceNumberInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'united-kingdom-national-insurance-number-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.united-kingdom-national-insurance-number-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('united-kingdom-national-insurance-number-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.united-kingdom-national-insurance-number-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.united-kingdom-national-insurance-number-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
