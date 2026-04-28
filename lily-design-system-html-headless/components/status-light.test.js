// status-light.test.js
// StatusLight component test

const path = require('path');

describe('StatusLight', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'status-light.html'));
  });

  it('should render a span with correct class', async function() {
    const el = await $('span.status-light');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('status-light');
  });

  it('should have role="status"', async function() {
    const el = await $('span.status-light');
    expect(await el.getAttribute('role')).toBe('status');
  });

  it('should have a data-variant attribute', async function() {
    const el = await $('span.status-light');
    const variant = await el.getAttribute('data-variant');
    expect(variant).not.toBeNull();
  });

  it('should render the dot span with aria-hidden="true"', async function() {
    const dot = await $('span.status-light > span.status-light-dot');
    await expect(dot).toExist();
    expect(await dot.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render the label span', async function() {
    const label = await $('span.status-light > span.status-light-label');
    await expect(label).toExist();
  });
});
