// cyprus-national-passport-number-view.test.js
// CyprusNationalPassportNumberView component test

const path = require('path');

describe('CyprusNationalPassportNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'cyprus-national-passport-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.cyprus-national-passport-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('cyprus-national-passport-number-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.cyprus-national-passport-number-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
