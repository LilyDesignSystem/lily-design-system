// overlay-container.test.js
// OverlayContainer component test

const path = require('path');

describe('OverlayContainer', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'overlay-container.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.overlay-container');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('overlay-container');
  });

  it('should have role="presentation"', async function() {
    const el = await $('div.overlay-container');
    const role = await el.getAttribute('role');
    expect(role).toBe('presentation');
  });

  it('should have a data-open attribute', async function() {
    const el = await $('div.overlay-container');
    const open = await el.getAttribute('data-open');
    expect(open).not.toBeNull();
  });

  it('should have aria-hidden matching the closed state', async function() {
    const el = await $('div.overlay-container');
    const hidden = await el.getAttribute('aria-hidden');
    expect(hidden).toBe('true');
  });

  it('should toggle hidden and aria-hidden when data-open changes to true', async function() {
    const el = await $('div.overlay-container');
    // Programmatically open via the attached helper, then verify state.
    await browser.execute(function() {
      var overlay = document.querySelector('div.overlay-container');
      overlay.openOverlay();
    });
    const hidden = await el.getAttribute('aria-hidden');
    expect(hidden).toBe('false');
    const hiddenAttr = await el.getAttribute('hidden');
    expect(hiddenAttr).toBeNull();
  });
});
