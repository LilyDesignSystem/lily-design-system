// blockquote.test.js
// Blockquote component test

const path = require('path');

describe('Blockquote', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'blockquote.html'));
  });

  it('should render the blockquote element with correct class', async function() {
    const el = await $('blockquote.blockquote');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('blockquote');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('blockquote.blockquote');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should support the cite attribute', async function() {
    const el = await $('blockquote.blockquote');
    const cite = await el.getAttribute('cite');
    // cite attribute should be present (even if empty in template)
    expect(cite).not.toBeNull();
  });

  it('should contain a citation footer', async function() {
    const footer = await $('blockquote.blockquote footer.blockquote-citation');
    await expect(footer).toExist();
  });
});
