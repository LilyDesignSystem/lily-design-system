// zhongguo-jumin-shenfenzheng-haoma-input.test.js
// ZhongguoJuminShenfenzhengHaomaInput component test

const path = require('path');

describe('ZhongguoJuminShenfenzhengHaomaInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'zhongguo-jumin-shenfenzheng-haoma-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.zhongguo-jumin-shenfenzheng-haoma-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('zhongguo-jumin-shenfenzheng-haoma-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.zhongguo-jumin-shenfenzheng-haoma-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.zhongguo-jumin-shenfenzheng-haoma-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
