// tool-call-name.test.js
// ToolCallName component test

const path = require('path');

describe('ToolCallName', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tool-call-name.html'));
  });

  it('should render a span with the base class as its first class', async function() {
    const el = await $('span.tool-call-name');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('tool-call-name');
  });

  it('should not ship inline styles', async function() {
    const el = await $('span.tool-call-name');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
