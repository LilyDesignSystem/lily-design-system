// wheel-picker.test.js
// WheelPicker component test

const path = require('path');

describe('WheelPicker', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'wheel-picker.html'));
  });

  it('should render a div with the base class as its first class and a vertical listbox inside', async function() {
    const root = await $('div.wheel-picker');
    await expect(root).toExist();
    expect((await root.getAttribute('class')).split(' ')[0]).toBe('wheel-picker');
    const list = await $('.wheel-picker-list');
    expect(await list.getAttribute('role')).toBe('listbox');
    expect(await list.getAttribute('aria-orientation')).toBe('vertical');
    expect(await list.getAttribute('aria-label')).not.toBeNull();
  });

  it('should mark exactly one option selected and point aria-activedescendant at it', async function() {
    const selected = await $$('[role=option][aria-selected=true]');
    expect(selected.length).toBe(1);
    const list = await $('.wheel-picker-list');
    expect(await list.getAttribute('aria-activedescendant')).toBe(await selected[0].getAttribute('id'));
  });

  it('should move the selection with the arrow keys, skipping a disabled option', async function() {
    // Focus, don't click: a click lands on whichever option is under the pointer and selects it.
    await browser.execute(() => document.querySelector('.wheel-picker-list').focus());
    await browser.keys(['ArrowDown']);
    expect(await (await $('[role=option][aria-selected=true]')).getText()).toBe('March');
    await browser.keys(['ArrowDown']);
    expect(await (await $('[role=option][aria-selected=true]')).getText()).toBe('May');
  });

  it('should select an option on click and keep a disabled option unselectable', async function() {
    await (await $('[data-value="5"]')).click();
    expect(await (await $('[role=option][aria-selected=true]')).getText()).toBe('May');
    await (await $('[data-value="4"]')).click();
    expect(await (await $('[role=option][aria-selected=true]')).getText()).toBe('May');
  });

  it('should keep the hidden input in step with the selection', async function() {
    await (await $('[data-value="3"]')).click();
    expect(await (await $('input[type=hidden]')).getValue()).toBe('3');
  });
});
