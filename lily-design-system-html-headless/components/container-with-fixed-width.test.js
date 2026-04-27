// container-with-fixed-width.test.js
// ContainerWithFixedWidth component test

const path = require('path');

describe('ContainerWithFixedWidth', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'container-with-fixed-width.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.container-with-fixed-width');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('container-with-fixed-width');
  });

  it('should have a data-max-width attribute', async function() {
    const el = await $('div.container-with-fixed-width');
    const value = await el.getAttribute('data-max-width');
    expect(value).not.toBeNull();
  });

  it('should have inline style for max-width and margin-inline', async function() {
    const el = await $('div.container-with-fixed-width');
    const style = await el.getAttribute('style');
    expect(style).toContain('max-width');
    expect(style).toContain('margin-inline');
  });
});
