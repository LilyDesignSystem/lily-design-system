// gantt-table-head.test.js
// GanttTableHead component test

const path = require('path');

describe('GanttTableHead', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-head.html'));
  });

  it('should render the thead element with correct class', async function() {
    const el = await $('thead.gantt-table-head');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-head');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('thead.gantt-table-head');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
