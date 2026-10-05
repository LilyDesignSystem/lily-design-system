// tool-call-status.test.js
// ToolCallStatus component test

const path = require('path');

describe('ToolCallStatus', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tool-call-status.html'));
  });

  it('should render a span with the base class as its first class', async function() {
    const el = await $('span.tool-call-status');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('tool-call-status');
  });

  it('should carry data-status and a visible status word', async function() {
    const el = await $('span.tool-call-status');
    expect(await el.getAttribute('data-status')).toBe('running');
    expect(await el.getText()).toBe('Running');
  });

  it('should not ship inline styles', async function() {
    const el = await $('span.tool-call-status');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
