// heatmap-chart-with-year-of-days.test.js
// HeatmapChartWithYearOfDays component test

const path = require('path');

describe('HeatmapChartWithYearOfDays', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'heatmap-chart-with-year-of-days.html'));
  });

  it('should render a figure element with the base class as its first class', async function() {
    const el = await $('figure.heatmap-chart-with-year-of-days');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('heatmap-chart-with-year-of-days');
  });

  it('should not put role=img on the figure', async function() {
    const el = await $('figure.heatmap-chart-with-year-of-days');
    expect(await el.getAttribute('role')).toBeNull();
  });

  it('should expose the graphic as a single named image', async function() {
    const g = await $('.heatmap-chart-with-year-of-days-graphic');
    expect(await g.getAttribute('role')).toBe('img');
    expect(await g.getAttribute('aria-label')).toBe('Example');
  });

  it('should reference a description via aria-describedby on the graphic', async function() {
    const g = await $('.heatmap-chart-with-year-of-days-graphic');
    const id = await g.getAttribute('aria-describedby');
    expect(id).toBe('heatmap-chart-with-year-of-days-desc');
    await expect($('#' + id)).toExist();
  });

  it('should contain the consumer-supplied svg inside the graphic', async function() {
    await expect($('.heatmap-chart-with-year-of-days-graphic svg')).toExist();
  });

  it('should render the data table as a sibling of the graphic, outside role=img', async function() {
    const outside = await browser.execute(() => {
      const t = document.querySelector('.heatmap-chart-with-year-of-days-data-table table');
      const wrap = document.querySelector('.heatmap-chart-with-year-of-days-data-table');
      const g = document.querySelector('.heatmap-chart-with-year-of-days-graphic');
      return !!t && !t.closest('[role=img]') && wrap.previousElementSibling === g && wrap.parentElement.tagName === 'FIGURE';
    });
    expect(outside).toBe(true);
  });

  it('should not ship inline styles on the figure', async function() {
    const el = await $('figure.heatmap-chart-with-year-of-days');
    expect(await el.getAttribute('style')).toBeNull();
  });

  it('should carry data-year and data-week-start on the figure', async function() {
    const el = await $('figure.heatmap-chart-with-year-of-days');
    expect(await el.getAttribute('data-year')).toBe('2026');
    expect(await el.getAttribute('data-week-start')).toBe('0');
  });
});
