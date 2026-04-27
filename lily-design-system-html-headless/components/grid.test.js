// grid.test.js
// Grid component test

const path = require('path');

describe('Grid', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'grid.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.grid');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('grid');
  });

  it('should have a data-columns attribute', async function() {
    const el = await $('div.grid');
    const cols = await el.getAttribute('data-columns');
    expect(cols).not.toBeNull();
  });

  it('should have inline style for display grid and grid-template-columns and gap', async function() {
    const el = await $('div.grid');
    const style = await el.getAttribute('style');
    expect(style).toContain('display: grid');
    expect(style).toContain('grid-template-columns');
    expect(style).toContain('gap');
  });
});
