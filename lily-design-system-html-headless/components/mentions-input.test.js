// mentions-input.test.js
// MentionsInput component test

const path = require('path');

describe('MentionsInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'mentions-input.html'));
  });

  it('should render a div wrapper with the mentions-input class', async function() {
    const el = await $('div.mentions-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('mentions-input');
  });

  it('should expose data-trigger-char on the wrapper', async function() {
    const el = await $('div.mentions-input');
    const trigger = await el.getAttribute('data-trigger-char');
    expect(trigger).not.toBeNull();
  });

  it('should contain an input with role="combobox" and ARIA combobox attributes', async function() {
    const input = await $('input.mentions-input-control');
    await expect(input).toExist();
    const role = await input.getAttribute('role');
    const haspopup = await input.getAttribute('aria-haspopup');
    const autocomplete = await input.getAttribute('aria-autocomplete');
    expect(role).toBe('combobox');
    expect(haspopup).toBe('listbox');
    expect(autocomplete).toBe('list');
  });

  it('should have aria-label on the input', async function() {
    const input = await $('input.mentions-input-control');
    const label = await input.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have aria-expanded set to false initially', async function() {
    const input = await $('input.mentions-input-control');
    const expanded = await input.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
  });

  it('should have a suggestions panel hidden by default', async function() {
    const panel = await $('div.mentions-input-suggestions');
    await expect(panel).toExist();
    const hidden = await panel.getAttribute('hidden');
    expect(hidden).not.toBeNull();
  });

  it('should open the suggestions panel when the trigger character is typed', async function() {
    const input = await $('input.mentions-input-control');
    const panel = await $('div.mentions-input-suggestions');
    await input.click();
    await browser.keys(['@']);
    const hidden = await panel.getAttribute('hidden');
    const expanded = await input.getAttribute('aria-expanded');
    expect(hidden).toBeNull();
    expect(expanded).toBe('true');
  });
});
