// share-page.test.js
// SharePage component test

const path = require('path');

describe('SharePage', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'share-page.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.share-page');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('share-page');
  });
});
