// tool-call.test.js
// ToolCall component test

const path = require('path');

describe('ToolCall', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tool-call.html'));
  });

  it('should render a details element with the base class as its first class', async function() {
    const el = await $('details.tool-call');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('tool-call');
  });

  it('should have a summary and a content wrapper', async function() {
    await expect($('details.tool-call > summary.tool-call-summary')).toExist();
    await expect($('details.tool-call > div.tool-call-content')).toExist();
  });

  it('should carry data-status, and aria-busy only while running', async function() {
    const running = await $('details.tool-call[data-status=running]');
    expect(await running.getAttribute('aria-busy')).toBe('true');
    const err = await $('#tool-call-error');
    expect(await err.getAttribute('data-status')).toBe('error');
    expect(await err.getAttribute('aria-busy')).toBeNull();
  });

  it('should show the status as a word', async function() {
    expect(await (await $('.tool-call-status[data-status=running]')).getText()).toBe('Running');
  });

  it('should render the error as an alert and the input as a named group', async function() {
    expect(await (await $('.tool-call-error')).getAttribute('role')).toBe('alert');
    const g = await $('.tool-call-input');
    expect(await g.getAttribute('role')).toBe('group');
    expect(await g.getAttribute('aria-label')).toBe('Arguments');
  });

  it('should not ship inline styles', async function() {
    expect(await (await $('details.tool-call')).getAttribute('style')).toBeNull();
  });
});
