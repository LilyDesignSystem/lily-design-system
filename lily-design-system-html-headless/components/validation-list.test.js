// validation-list.test.js
// ValidationList component test

const path = require('path');

describe('ValidationList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'validation-list.html'));
  });

  it('should render the ul element with correct class', async function() {
    const el = await $('ul.validation-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('validation-list');
  });

  it('should be a <ul> element', async function() {
    const el = await $('ul.validation-list');
    const tag = await el.getTagName();
    expect(tag).toBe('ul');
  });

  it('should have aria-label and aria-live="polite"', async function() {
    const el = await $('ul.validation-list');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
    const live = await el.getAttribute('aria-live');
    expect(live).toBe('polite');
  });
});
