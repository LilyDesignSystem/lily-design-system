// gantt-table-tr.test.js
// GanttTableTR component test

const path = require('path');

describe('GanttTableTR', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-tr.html'));
  });

  it('should render the tr element with correct class', async function() {
    const el = await $('tr.gantt-table-tr');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-tr');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('tr.gantt-table-tr');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
