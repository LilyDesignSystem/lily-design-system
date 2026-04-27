// masonry.test.js
// Masonry component test

const path = require('path');

describe('Masonry', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'masonry.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.masonry');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('masonry');
  });

  it('should have a data-columns attribute', async function() {
    const el = await $('div.masonry');
    const cols = await el.getAttribute('data-columns');
    expect(cols).not.toBeNull();
  });

  it('should have inline style for column-count and column-gap', async function() {
    const el = await $('div.masonry');
    const style = await el.getAttribute('style');
    expect(style).toContain('column-count');
    expect(style).toContain('column-gap');
  });
});
