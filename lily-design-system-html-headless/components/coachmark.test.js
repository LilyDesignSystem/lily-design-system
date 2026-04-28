// coachmark.test.js
// Coachmark component test

const path = require('path');

describe('Coachmark', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'coachmark.html'));
  });

  it('should render the dialog element with correct class', async function() {
    const el = await $('div.coachmark');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('coachmark');
  });

  it('should have role="dialog"', async function() {
    const el = await $('div.coachmark');
    const role = await el.getAttribute('role');
    expect(role).toBe('dialog');
  });

  it('should have aria-modal="false"', async function() {
    const el = await $('div.coachmark');
    const ariaModal = await el.getAttribute('aria-modal');
    expect(ariaModal).toBe('false');
  });

  it('should have aria-labelledby pointing at the title', async function() {
    const el = await $('div.coachmark');
    const labelledBy = await el.getAttribute('aria-labelledby');
    expect(labelledBy).not.toBeNull();
    const titleEl = await $('#' + labelledBy);
    await expect(titleEl).toExist();
  });

  it('should have a dismiss button with aria-label', async function() {
    const dismiss = await $('button.coachmark-dismiss');
    await expect(dismiss).toExist();
    const label = await dismiss.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should hide the coachmark when dismiss is clicked', async function() {
    const coachmark = await $('div.coachmark');
    const dismiss = await $('button.coachmark-dismiss');

    // Initially visible (no hidden attribute).
    const hiddenBefore = await coachmark.getAttribute('hidden');
    expect(hiddenBefore).toBeNull();

    await dismiss.click();

    const hiddenAfter = await coachmark.getAttribute('hidden');
    expect(hiddenAfter).not.toBeNull();
  });
});
