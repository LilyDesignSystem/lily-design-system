// tool-call-error.test.js
// ToolCallError component test

const path = require('path');

describe('ToolCallError', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tool-call-error.html'));
  });

  it('should render a div with the base class as its first class', async function() {
    const el = await $('div.tool-call-error');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('tool-call-error');
  });

  it('should be an alert region', async function() {
    const el = await $('div.tool-call-error');
    expect(await el.getAttribute('role')).toBe('alert');
  });

  it('should not ship inline styles', async function() {
    const el = await $('div.tool-call-error');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
