// footnote.test.js
// Footnote component test

const path = require('path');

describe('Footnote', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'footnote.html'));
  });

  it('should render the aside element with correct class', async function() {
    const el = await $('aside.footnote');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('footnote');
  });

  it('should have role="note"', async function() {
    const el = await $('aside.footnote');
    const role = await el.getAttribute('role');
    expect(role).toBe('note');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('aside.footnote');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
