// gantt-table-thead.test.js
// GanttTableThead component test

const path = require('path');

describe('GanttTableThead', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-thead.html'));
  });

  it('should render the thead element with correct class', async function() {
    const el = await $('thead.gantt-table-thead');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-thead');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('thead.gantt-table-thead');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
