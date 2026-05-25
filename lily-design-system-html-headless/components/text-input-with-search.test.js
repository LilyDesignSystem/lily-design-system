// text-input-with-search.test.js
// TextInputWithSearch component test

const path = require('path');

describe('TextInputWithSearch', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'text-input-with-search.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.text-input-with-search');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('text-input-with-search');
  });
});
