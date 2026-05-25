// description-list.test.js
// DescriptionList component test

const path = require('path');

describe('DescriptionList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'description-list.html'));
  });

  it('should render the dl element with correct class', async function() {
    const el = await $('dl.description-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('description-list');
  });
});
