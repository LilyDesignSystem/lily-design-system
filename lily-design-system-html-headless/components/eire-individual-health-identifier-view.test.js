// eire-individual-health-identifier-view.test.js
// EireIndividualHealthIdentifierView component test

const path = require('path');

describe('EireIndividualHealthIdentifierView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'eire-individual-health-identifier-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.eire-individual-health-identifier-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('eire-individual-health-identifier-view');
  });
});
