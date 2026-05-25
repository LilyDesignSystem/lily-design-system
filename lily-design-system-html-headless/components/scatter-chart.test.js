// scatter-chart.test.js
// ScatterChart component test

const path = require('path');

describe('ScatterChart', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'scatter-chart.html'));
  });

  it('should render the figure element with correct class', async function() {
    const el = await $('figure.scatter-chart');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('scatter-chart');
  });
});
