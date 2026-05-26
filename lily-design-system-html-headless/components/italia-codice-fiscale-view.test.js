// italia-codice-fiscale-view.test.js
// ItaliaCodiceFiscaleView component test

const path = require('path');

describe('ItaliaCodiceFiscaleView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'italia-codice-fiscale-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.italia-codice-fiscale-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('italia-codice-fiscale-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.italia-codice-fiscale-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
