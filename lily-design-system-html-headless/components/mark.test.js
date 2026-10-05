// mark.test.js
// Mark component test

const path = require('path');

describe('Mark', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'mark.html'));
  });

  it('should render a mark with the base class as its first class', async function() {
    const el = await $('mark.mark');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('mark');
  });

  it('should not ship inline styles', async function() {
    const el = await $('mark.mark');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
