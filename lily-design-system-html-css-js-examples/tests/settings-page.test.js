// settings-page.test.js
// Settings Page test

const path = require('path');

describe('Settings Page', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'settings-page.html'));
  });

  it('should render fieldsets', async function() {
    const fieldsets = await $$('fieldset.fieldset');
    expect(fieldsets.length).toBe(2);
  });

  it('should render switch buttons with correct role', async function() {
    const switches = await $$('button.switch-button');
    expect(switches.length).toBe(3);
    const role = await switches[0].getAttribute('role');
    expect(role).toBe('switch');
  });

  it('should toggle switch button on click', async function() {
    const darkMode = await $('button#dark-mode-switch');
    const before = await darkMode.getAttribute('aria-checked');
    expect(before).toBe('false');
    await darkMode.click();
    const after = await darkMode.getAttribute('aria-checked');
    expect(after).toBe('true');
  });

  it('should render the language select', async function() {
    const el = await $('select.select#language');
    await expect(el).toExist();
  });

  it('should render the radio group for font size', async function() {
    const el = await $('div.radio-group');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('radiogroup');
  });

  it('should render radio inputs', async function() {
    const radios = await $$('input.radio-input');
    expect(radios.length).toBe(3);
  });

  it('should show save banner on save button click', async function() {
    const saveBtn = await $('button#save-button');
    await saveBtn.click();
    const banner = await $('div#save-banner');
    const hidden = await banner.getAttribute('hidden');
    expect(hidden).toBeNull();
  });
});
