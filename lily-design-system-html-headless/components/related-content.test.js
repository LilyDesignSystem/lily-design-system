// related-content.test.js
// RelatedContent component test

const path = require('path');

describe('RelatedContent', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'related-content.html'));
  });

  it('should render the aside element with correct class', async function() {
    const el = await $('aside.related-content');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('related-content');
  });
});
