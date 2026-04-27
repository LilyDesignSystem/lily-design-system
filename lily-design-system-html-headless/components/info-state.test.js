// info-state.test.js
// InfoState component test

const path = require('path');

describe('InfoState', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'info-state.html'));
  });

  it('should render the section element with correct class', async function() {
    const el = await $('section.info-state');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('info-state');
  });

  it('should have role="status"', async function() {
    const el = await $('section.info-state');
    const role = await el.getAttribute('role');
    expect(role).toBe('status');
  });

  it('should have a data-level attribute', async function() {
    const el = await $('section.info-state');
    const level = await el.getAttribute('data-level');
    expect(level).not.toBeNull();
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('section.info-state');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a title heading', async function() {
    const title = await $('section.info-state h2.info-state-title');
    await expect(title).toExist();
  });
});
