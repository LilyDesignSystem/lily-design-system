// government-identifier.test.js
// GovernmentIdentifier component test

const path = require('path');

describe('GovernmentIdentifier', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'government-identifier.html'));
  });

  it('should render the section element with correct class', async function() {
    const el = await $('section.government-identifier');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('government-identifier');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('section.government-identifier');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a masthead and a links nav', async function() {
    const masthead = await $('section.government-identifier .government-identifier-masthead');
    await expect(masthead).toExist();
    const nav = await $('section.government-identifier nav.government-identifier-links');
    await expect(nav).toExist();
    const navLabel = await nav.getAttribute('aria-label');
    expect(navLabel).not.toBeNull();
  });
});
