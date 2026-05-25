// mutually-exclusive.test.js
// MutuallyExclusive component test

const path = require('path');

describe('MutuallyExclusive', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'mutually-exclusive.html'));
  });

  it('should render the fieldset element with correct class', async function() {
    const el = await $('fieldset.mutually-exclusive');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('mutually-exclusive');
  });
});
