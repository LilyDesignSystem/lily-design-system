// eire-individual-health-identifier-input.test.js
// EireIndividualHealthIdentifierInput component test

const path = require('path');

describe('EireIndividualHealthIdentifierInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'eire-individual-health-identifier-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.eire-individual-health-identifier-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('eire-individual-health-identifier-input');
  });
});
