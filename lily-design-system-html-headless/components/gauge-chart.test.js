// gauge-chart.test.js
// GaugeChart component test

const path = require('path');

describe('GaugeChart', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gauge-chart.html'));
  });

  it('should render a figure element with the base class', async function() {
    const el = await $('figure.gauge-chart');
    await expect(el).toExist();
  });

  it('should have the base class as its first class', async function() {
    const el = await $('figure');
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('gauge-chart');
  });

  it('should expose the chart as a single image', async function() {
    const el = await $('figure.gauge-chart');
    expect(await el.getAttribute('role')).toBe('img');
  });

  it('should set aria-label', async function() {
    const el = await $('figure.gauge-chart');
    expect(await el.getAttribute('aria-label')).toBe('Example');
  });

  it('should reference a description via aria-describedby', async function() {
    const el = await $('figure.gauge-chart');
    const id = await el.getAttribute('aria-describedby');
    expect(id).toBe('gauge-chart-desc');
    await expect($('#' + id)).toExist();
  });

  it('should contain the consumer-supplied svg', async function() {
    const svg = await $('figure.gauge-chart svg');
    await expect(svg).toExist();
  });

  it('should not ship inline styles on the figure', async function() {
    const el = await $('figure.gauge-chart');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
