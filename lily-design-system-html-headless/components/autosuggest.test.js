// autosuggest.test.js
// Autosuggest component test

const path = require('path');

describe('Autosuggest', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'autosuggest.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.autosuggest');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('autosuggest');
  });
});
