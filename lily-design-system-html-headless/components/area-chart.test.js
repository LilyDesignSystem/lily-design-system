// area-chart.test.js
// AreaChart component test

const path = require('path');

describe('AreaChart', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'area-chart.html'));
  });

  it('should render the figure element with correct class', async function() {
    const el = await $('figure.area-chart');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('area-chart');
  });
});
