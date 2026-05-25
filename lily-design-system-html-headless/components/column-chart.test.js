// column-chart.test.js
// ColumnChart component test

const path = require('path');

describe('ColumnChart', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'column-chart.html'));
  });

  it('should render the figure element with correct class', async function() {
    const el = await $('figure.column-chart');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('column-chart');
  });
});
