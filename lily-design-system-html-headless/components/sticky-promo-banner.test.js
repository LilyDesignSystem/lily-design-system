// sticky-promo-banner.test.js
// StickyPromoBanner component test

const path = require('path');

describe('StickyPromoBanner', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'sticky-promo-banner.html'));
  });

  it('should render the aside element with correct class', async function() {
    const el = await $('aside.sticky-promo-banner');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('sticky-promo-banner');
  });

  it('should have role="complementary" and an aria-label', async function() {
    const el = await $('aside.sticky-promo-banner');
    expect(await el.getAttribute('role')).toBe('complementary');
    expect(await el.getAttribute('aria-label')).not.toBeNull();
  });

  it('should have a data-position attribute', async function() {
    const el = await $('aside.sticky-promo-banner');
    const pos = await el.getAttribute('data-position');
    expect(['top', 'bottom']).toContain(pos);
  });

  it('should have inline style with position: fixed and edge anchors', async function() {
    const el = await $('aside.sticky-promo-banner');
    const style = (await el.getAttribute('style')) || '';
    expect(style).toContain('position');
    expect(style).toContain('fixed');
    expect(style).toContain('left');
    expect(style).toContain('right');
  });

  it('should contain a dismiss button with aria-label', async function() {
    const btn = await $('aside.sticky-promo-banner button.sticky-promo-banner-dismiss');
    await expect(btn).toExist();
    expect(await btn.getAttribute('type')).toBe('button');
    expect(await btn.getAttribute('aria-label')).not.toBeNull();
  });

  it('should hide the banner when the dismiss button is clicked', async function() {
    const banner = await $('aside.sticky-promo-banner');
    expect(await banner.getAttribute('hidden')).toBeNull();
    const btn = await $('aside.sticky-promo-banner button.sticky-promo-banner-dismiss');
    await btn.click();
    // hidden attribute should now be present on the root aside.
    expect(await banner.getAttribute('hidden')).not.toBeNull();
  });

  it('should re-anchor when data-position changes from "bottom" to "top"', async function() {
    await browser.execute(function() {
      document.querySelector('aside.sticky-promo-banner').setAttribute('data-position', 'top');
    });
    await browser.pause(50);
    const banner = await $('aside.sticky-promo-banner');
    const style = (await banner.getAttribute('style')) || '';
    expect(style).toContain('top');
  });
});
