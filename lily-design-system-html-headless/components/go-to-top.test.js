// go-to-top.test.js
// GoToTop component test

const path = require('path');

describe('GoToTop', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'go-to-top.html'));
  });

  it('should render the a element with correct class', async function() {
    const el = await $('a.go-to-top');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('go-to-top');
  });
});
