// summary-box.test.js
// SummaryBox component test

const path = require('path');

describe('SummaryBox', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'summary-box.html'));
  });

  it('should render the aside element with correct class', async function() {
    const el = await $('aside.summary-box');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('summary-box');
  });

  it('should be an <aside> element', async function() {
    const el = await $('aside.summary-box');
    const tag = await el.getTagName();
    expect(tag).toBe('aside');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('aside.summary-box');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain heading and body regions', async function() {
    const heading = await $('aside.summary-box h3.summary-box-heading');
    await expect(heading).toExist();
    const body = await $('aside.summary-box .summary-box-body');
    await expect(body).toExist();
  });
});
