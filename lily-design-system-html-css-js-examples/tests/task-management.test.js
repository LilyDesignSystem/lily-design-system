// task-management.test.js
// Task Management page test

const path = require('path');

describe('Task Management', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'task-management.html'));
  });

  it('should render the task list', async function() {
    const el = await $('ol.task-list');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Project tasks');
  });

  it('should render task list items', async function() {
    const items = await $$('li.task-list-item');
    expect(items.length).toBe(5);
  });

  it('should render the progress bar', async function() {
    const el = await $('progress.progress');
    await expect(el).toExist();
  });

  it('should render the new task input', async function() {
    const el = await $('input.text-input#new-task-input');
    await expect(el).toExist();
  });

  it('should render the add task button', async function() {
    const el = await $('button#add-task-btn');
    await expect(el).toExist();
  });

  it('should add a new task', async function() {
    await $('input#new-task-input').setValue('New test task');
    await $('button#add-task-btn').click();
    const items = await $$('li.task-list-item');
    expect(items.length).toBe(6);
  });

  it('should toggle a task checkbox', async function() {
    const checkboxes = await $$('li.task-list-item input.checkbox-input');
    const first = checkboxes[0];
    const before = await first.isSelected();
    await first.click();
    const after = await first.isSelected();
    expect(after).not.toBe(before);
  });

  it('should render the show completed checkbox', async function() {
    const el = await $('input.checkbox-input#show-completed');
    await expect(el).toExist();
  });

  it('should filter out completed tasks when unchecked', async function() {
    await $('input#show-completed').click();
    const items = await $$('li.task-list-item');
    expect(items.length).toBe(3);
  });

  it('should render priority badges', async function() {
    const badges = await $$('span.badge');
    expect(badges.length).toBeGreaterThan(0);
  });
});
