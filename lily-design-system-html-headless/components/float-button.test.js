// float-button.test.js
// FloatButton component test

const path = require('path');

describe('FloatButton', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'float-button.html'));
  });

  it('should render a button element with the float-button class', async function() {
    const el = await $('button.float-button');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('float-button');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('button.float-button');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should default to type="button"', async function() {
    const el = await $('button.float-button');
    const type = await el.getAttribute('type');
    expect(type).toBe('button');
  });

  it('should expose a data-position attribute for the corner anchor', async function() {
    const el = await $('button.float-button');
    const position = await el.getAttribute('data-position');
    expect(position).not.toBeNull();
  });

  it('should use position: fixed for floating placement', async function() {
    const el = await $('button.float-button');
    const style = await el.getAttribute('style');
    expect(style).toContain('position: fixed');
  });

  it('should be activatable via click', async function() {
    const el = await $('button.float-button');
    await el.click();
    await expect(el).toExist();
  });
});
