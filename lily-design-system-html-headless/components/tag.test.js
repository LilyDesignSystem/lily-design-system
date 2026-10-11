// tag.test.js
// Tag component test

const path = require('path');

describe('Tag', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tag.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.tag');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('tag');
  });

  it('is not a live region and carries its label as screen-reader text', async function() {
    const el = await $('span.tag');
    expect(await el.getAttribute('role')).toBeNull();
    expect(await el.getAttribute('aria-label')).toBeNull();
    await expect(await $('span.tag > span.screen-reader-span')).toExist();
    await expect(await $('span.tag [aria-hidden]')).not.toExist();
  });
});
