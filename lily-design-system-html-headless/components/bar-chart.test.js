// bar-chart.test.js
// BarChart component test

const path = require('path');

describe('BarChart', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'bar-chart.html'));
  });

  it('should render the figure element with correct class', async function() {
    const el = await $('figure.bar-chart');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('bar-chart');
  });
});
