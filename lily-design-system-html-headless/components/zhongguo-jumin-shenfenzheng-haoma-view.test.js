// zhongguo-jumin-shenfenzheng-haoma-view.test.js
// ZhongguoJuminShenfenzhengHaomaView component test

const path = require('path');

describe('ZhongguoJuminShenfenzhengHaomaView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'zhongguo-jumin-shenfenzheng-haoma-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.zhongguo-jumin-shenfenzheng-haoma-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('zhongguo-jumin-shenfenzheng-haoma-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.zhongguo-jumin-shenfenzheng-haoma-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
