// line-chart.test.js
// LineChart component test

const path = require('path');

describe('LineChart', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'line-chart.html'));
  });

  it('should render the figure element with correct class', async function() {
    const el = await $('figure.line-chart');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('line-chart');
  });
});
