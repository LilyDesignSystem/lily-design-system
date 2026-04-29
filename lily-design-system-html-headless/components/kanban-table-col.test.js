// kanban-table-col.test.js
// KanbanTableTD component test

const path = require('path');

describe('KanbanTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'kanban-table-col.html'));
  });

  it('should render the th element with correct class', async function() {
    const el = await $('th.kanban-table-col');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('kanban-table-col');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('th.kanban-table-col');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
