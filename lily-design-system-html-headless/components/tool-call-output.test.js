// tool-call-output.test.js
// ToolCallOutput component test

const path = require('path');

describe('ToolCallOutput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tool-call-output.html'));
  });

  it('should render a div with the base class as its first class', async function() {
    const el = await $('div.tool-call-output');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('tool-call-output');
  });

  it('should be a named group', async function() {
    const el = await $('div.tool-call-output');
    expect(await el.getAttribute('role')).toBe('group');
    expect(await el.getAttribute('aria-label')).toBe('Arguments');
  });

  it('should not ship inline styles', async function() {
    const el = await $('div.tool-call-output');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
