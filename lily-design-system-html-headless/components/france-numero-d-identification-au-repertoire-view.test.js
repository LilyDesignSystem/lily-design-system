// france-numero-d-identification-au-repertoire-view.test.js
// FranceNumeroDIdentificationAuRepertoireView component test

const path = require('path');

describe('FranceNumeroDIdentificationAuRepertoireView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'france-numero-d-identification-au-repertoire-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.france-numero-d-identification-au-repertoire-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('france-numero-d-identification-au-repertoire-view');
  });
});
