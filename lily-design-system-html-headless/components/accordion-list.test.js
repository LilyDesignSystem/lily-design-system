// accordion-list.test.js
// AccordionList component test

const path = require('path');

describe('AccordionList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'accordion-list.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.accordion-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('accordion-list');
  });

  it('should have role="group"', async function() {
    const el = await $('div.accordion-list');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.accordion-list');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
