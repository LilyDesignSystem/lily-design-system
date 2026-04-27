// container-with-fluid-width.test.js
// ContainerWithFluidWidth component test

const path = require('path');

describe('ContainerWithFluidWidth', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'container-with-fluid-width.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.container-with-fluid-width');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('container-with-fluid-width');
  });

  it('should have a data-padding-inline attribute', async function() {
    const el = await $('div.container-with-fluid-width');
    const value = await el.getAttribute('data-padding-inline');
    expect(value).not.toBeNull();
  });

  it('should have inline style for width and padding-inline', async function() {
    const el = await $('div.container-with-fluid-width');
    const style = await el.getAttribute('style');
    expect(style).toContain('width');
    expect(style).toContain('padding-inline');
  });
});
