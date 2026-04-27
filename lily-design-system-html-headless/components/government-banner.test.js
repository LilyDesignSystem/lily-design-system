// government-banner.test.js
// GovernmentBanner component test

const path = require('path');

describe('GovernmentBanner', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'government-banner.html'));
  });

  it('should render the aside element with correct class', async function() {
    const el = await $('aside.government-banner');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('government-banner');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('aside.government-banner');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a header with toggle button', async function() {
    const header = await $('aside.government-banner header.government-banner-header');
    await expect(header).toExist();
    const toggle = await $('aside.government-banner button.government-banner-toggle');
    await expect(toggle).toExist();
  });

  it('toggle button should have aria-expanded and aria-controls', async function() {
    const toggle = await $('button.government-banner-toggle');
    const expanded = await toggle.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
    const controls = await toggle.getAttribute('aria-controls');
    expect(controls).not.toBeNull();
  });

  it('details panel should be hidden initially', async function() {
    const panel = await $('div.government-banner-details');
    await expect(panel).toExist();
    const hidden = await panel.getAttribute('hidden');
    expect(hidden).not.toBeNull();
  });

  it('clicking toggle should flip aria-expanded and reveal the panel', async function() {
    const toggle = await $('button.government-banner-toggle');
    const panel = await $('div.government-banner-details');

    await toggle.click();
    let expanded = await toggle.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
    let hidden = await panel.getAttribute('hidden');
    expect(hidden).toBeNull();

    await toggle.click();
    expanded = await toggle.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
    hidden = await panel.getAttribute('hidden');
    expect(hidden).not.toBeNull();
  });
});
