// line-chart.test.js
// LineChart component test

const path = require('path');

describe('LineChart', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'line-chart.html'));
  });

  it('should render a figure element with the base class as its first class', async function() {
    const el = await $('figure.line-chart');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('line-chart');
  });

  it('should not put role=img on the figure', async function() {
    const el = await $('figure.line-chart');
    expect(await el.getAttribute('role')).toBeNull();
  });

  it('should expose the graphic as a single named image', async function() {
    const g = await $('.line-chart-graphic');
    expect(await g.getAttribute('role')).toBe('img');
    expect(await g.getAttribute('aria-label')).toBe('Example');
  });

  it('should contain the consumer-supplied svg inside the graphic', async function() {
    await expect($('.line-chart-graphic svg')).toExist();
  });

  it('should render the data table as a sibling of the graphic, outside role=img', async function() {
    const outside = await browser.execute(() => {
      const t = document.querySelector('.line-chart-data-table table');
      const wrap = document.querySelector('.line-chart-data-table');
      const g = document.querySelector('.line-chart-graphic');
      return !!t && !t.closest('[role=img]') && wrap.previousElementSibling === g && wrap.parentElement.tagName === 'FIGURE';
    });
    expect(outside).toBe(true);
  });

  it('should not ship inline styles on the figure', async function() {
    const el = await $('figure.line-chart');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
