// flex-stack.test.js
// FlexStack component test

const path = require('path');

describe('FlexStack', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'flex-stack.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.flex-stack');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('flex-stack');
  });

  it('should have a data-direction attribute', async function() {
    const el = await $('div.flex-stack');
    const dir = await el.getAttribute('data-direction');
    expect(dir).not.toBeNull();
  });

  it('should have inline style for display flex and flex-direction and gap', async function() {
    const el = await $('div.flex-stack');
    const style = await el.getAttribute('style');
    expect(style).toContain('display: flex');
    expect(style).toContain('flex-direction');
    expect(style).toContain('gap');
  });
});
