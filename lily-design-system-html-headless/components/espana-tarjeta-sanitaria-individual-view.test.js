// espana-tarjeta-sanitaria-individual-view.test.js
// EspanaTarjetaSanitariaIndividualView component test

const path = require('path');

describe('EspanaTarjetaSanitariaIndividualView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'espana-tarjeta-sanitaria-individual-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.espana-tarjeta-sanitaria-individual-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('espana-tarjeta-sanitaria-individual-view');
  });
});
