// clamp-text.test.js
// ClampText component test

const path = require('path');

describe('ClampText', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'clamp-text.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.clamp-text');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('clamp-text');
  });

  it('should have a data-lines attribute', async function() {
    const el = await $('div.clamp-text');
    const lines = await el.getAttribute('data-lines');
    expect(lines).not.toBeNull();
  });

  it('should have an inline style setting --clamp-text-lines', async function() {
    const el = await $('div.clamp-text');
    const style = await el.getAttribute('style');
    expect(style).toContain('--clamp-text-lines');
  });
});
