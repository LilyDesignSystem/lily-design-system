// gantt-table-th.test.js
// GanttTableTH component test

const path = require('path');

describe('GanttTableTH', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-th.html'));
  });

  it('should render the th element with correct class', async function() {
    const el = await $('th.gantt-table-th');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-th');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('th.gantt-table-th');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
