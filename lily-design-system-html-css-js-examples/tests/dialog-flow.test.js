// dialog-flow.test.js
// Dialog Flow page test

const path = require('path');

describe('Dialog Flow', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'dialog-flow.html'));
  });

  it('should render the confirm dialog element', async function() {
    const el = await $('dialog.dialog');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('dialog');
  });

  it('should render the alert dialog element', async function() {
    const el = await $('dialog.alert-dialog');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('alertdialog');
  });

  it('should render the drawer', async function() {
    const el = await $('div.drawer');
    await expect(el).toExist();
    const open = await el.getAttribute('data-open');
    expect(open).toBe('false');
  });

  it('should render the tooltip', async function() {
    const el = await $('div.tooltip');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('tooltip');
  });

  it('should open confirm dialog on delete button click', async function() {
    const deleteBtn = await $('button#delete-btn');
    await deleteBtn.click();
    const dialog = await $('dialog#confirm-dialog');
    const isOpen = await dialog.getAttribute('open');
    expect(isOpen).not.toBeNull();
  });

  it('should close confirm dialog on cancel', async function() {
    await $('button#delete-btn').click();
    await $('button#cancel-delete-btn').click();
    const dialog = await $('dialog#confirm-dialog');
    const isOpen = await dialog.getAttribute('open');
    expect(isOpen).toBeNull();
  });

  it('should open drawer on button click', async function() {
    await $('button#drawer-btn').click();
    const drawer = await $('div#help-drawer');
    const open = await drawer.getAttribute('data-open');
    expect(open).toBe('true');
  });

  it('should close drawer on close button click', async function() {
    await $('button#drawer-btn').click();
    await $('button#close-drawer-btn').click();
    const drawer = await $('div#help-drawer');
    const open = await drawer.getAttribute('data-open');
    expect(open).toBe('false');
  });
});
