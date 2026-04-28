// tab-panel.test.js
// TabPanel component test

const path = require('path');

describe('TabPanel', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tab-panel.html'));
  });

  it('should render the panel element with correct class', async function() {
    const el = await $('div.tab-panel');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('tab-panel');
  });

  it('should have role="tabpanel"', async function() {
    const el = await $('div.tab-panel');
    expect(await el.getAttribute('role')).toBe('tabpanel');
  });

  it('should be focusable with tabindex="0"', async function() {
    const el = await $('div.tab-panel');
    expect(await el.getAttribute('tabindex')).toBe('0');
  });

  it('should be hidden when data-selected is false', async function() {
    const el = await $('div.tab-panel');
    expect(await el.getAttribute('data-selected')).toBe('false');
    expect(await el.getAttribute('hidden')).not.toBeNull();
  });

  it('should sync hidden attribute when data-selected changes', async function() {
    const el = await $('div.tab-panel');

    // Flip data-selected to true and verify hidden is removed.
    await browser.execute(function() {
      var p = document.querySelector('div.tab-panel');
      p.setAttribute('data-selected', 'true');
    });
    // Allow MutationObserver to fire.
    await browser.pause(50);
    expect(await el.getAttribute('hidden')).toBeNull();

    // Flip back to false and verify hidden is restored.
    await browser.execute(function() {
      var p = document.querySelector('div.tab-panel');
      p.setAttribute('data-selected', 'false');
    });
    await browser.pause(50);
    expect(await el.getAttribute('hidden')).not.toBeNull();
  });
});
