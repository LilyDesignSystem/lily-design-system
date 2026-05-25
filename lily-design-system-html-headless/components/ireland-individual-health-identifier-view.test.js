// ireland-individual-health-identifier-view.test.js
// IrelandIndividualHealthIdentifierView component test

const path = require('path');

describe('IrelandIndividualHealthIdentifierView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'ireland-individual-health-identifier-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.ireland-individual-health-identifier-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('ireland-individual-health-identifier-view');
  });
});
