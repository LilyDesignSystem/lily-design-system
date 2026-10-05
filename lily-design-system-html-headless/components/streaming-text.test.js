// streaming-text.test.js
// StreamingText component test

const path = require('path');

describe('StreamingText', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'streaming-text.html'));
  });

  it('should render a div with the base class as its first class', async function() {
    const el = await $('div.streaming-text');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('streaming-text');
  });

  it('should be a polite, atomic status region', async function() {
    const el = await $('div.streaming-text');
    expect(await el.getAttribute('role')).toBe('status');
    expect(await el.getAttribute('aria-live')).toBe('polite');
    expect(await el.getAttribute('aria-atomic')).toBe('true');
  });

  it('should be busy while streaming', async function() {
    const el = await $('div.streaming-text');
    expect(await el.getAttribute('aria-busy')).toBe('true');
    expect(await el.getAttribute('data-streaming')).toBe('true');
  });

  it('should not be busy once complete', async function() {
    const el = await $('#streaming-text-done');
    expect(await el.getAttribute('aria-busy')).toBeNull();
    expect(await el.getAttribute('data-streaming')).toBeNull();
  });

  it('should have an accessible name from aria-label', async function() {
    const el = await $('div.streaming-text');
    expect(await el.getAttribute('aria-label')).toBe('Assistant answer');
  });

  it('should not ship inline styles', async function() {
    const el = await $('div.streaming-text');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
