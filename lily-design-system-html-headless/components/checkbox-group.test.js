// checkbox-group.test.js
// CheckboxGroup component test

const path = require('path');

describe('CheckboxGroup', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'checkbox-group.html'));
  });

  it('should render the fieldset element with correct class', async function() {
    const el = await $('fieldset.checkbox-group');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('checkbox-group');
  });

  it('should have the correct ARIA role', async function() {
    const el = await $('fieldset.checkbox-group');
    const roleAttr = await el.getAttribute('role');
    expect(roleAttr).toBe('group');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('fieldset.checkbox-group');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
