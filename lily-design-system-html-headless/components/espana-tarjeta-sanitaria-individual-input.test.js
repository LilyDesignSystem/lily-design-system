// espana-tarjeta-sanitaria-individual-input.test.js
// EspanaTarjetaSanitariaIndividualInput component test

const path = require('path');

describe('EspanaTarjetaSanitariaIndividualInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'espana-tarjeta-sanitaria-individual-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.espana-tarjeta-sanitaria-individual-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('espana-tarjeta-sanitaria-individual-input');
  });
});
