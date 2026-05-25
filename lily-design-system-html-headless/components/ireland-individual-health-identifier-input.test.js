// ireland-individual-health-identifier-input.test.js
// IrelandIndividualHealthIdentifierInput component test

const path = require('path');

describe('IrelandIndividualHealthIdentifierInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'ireland-individual-health-identifier-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.ireland-individual-health-identifier-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('ireland-individual-health-identifier-input');
  });
});
