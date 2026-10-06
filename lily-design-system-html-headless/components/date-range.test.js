// date-range.test.js
// DateRange component test

const path = require('path');

describe('DateRange', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'date-range.html'));
  });

  it('should render a fieldset with the base class and a group name', async function() {
    const el = await $('fieldset.date-range');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should hold two date inputs, each with its own accessible name', async function() {
    const inputs = await $$('fieldset.date-range input.date-input[type="date"]');
    expect(inputs.length).toBe(2);
    for (const input of inputs) {
      expect(await input.getAttribute('aria-label')).not.toBeNull();
    }
  });
});
