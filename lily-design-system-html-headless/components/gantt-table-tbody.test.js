// gantt-table-body.test.js
// GanttTableBody component test

const path = require('path');

describe('GanttTableBody', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-body.html'));
  });

  it('should render the tbody element with correct class', async function() {
    const el = await $('tbody.gantt-table-body');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-body');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('tbody.gantt-table-body');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
