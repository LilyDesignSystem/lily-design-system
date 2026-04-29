// gantt-table-tbody.test.js
// GanttTableTbody component test

const path = require('path');

describe('GanttTableTbody', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-tbody.html'));
  });

  it('should render the tbody element with correct class', async function() {
    const el = await $('tbody.gantt-table-tbody');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-tbody');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('tbody.gantt-table-tbody');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
