// middle-truncation.test.js
// MiddleTruncation component test

const path = require('path');

describe('MiddleTruncation', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'middle-truncation.html'));
    // The component ships no CSS: give the root the bounded block the consumer's CSS would, and hide the full text.
    await browser.execute(() => {
      const style = document.createElement('style');
      style.textContent = '.middle-truncation{display:block;position:relative;overflow:hidden;white-space:nowrap;width:12em}' +
        '.middle-truncation-full{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}';
      document.head.appendChild(style);
      window.dispatchEvent(new Event('resize'));
    });
  });

  it('should render a span with the base class as its first class', async function() {
    const el = await $('span.middle-truncation');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('middle-truncation');
  });

  it('should hide the shortened text from assistive technology and keep the full text', async function() {
    const visual = await $('.middle-truncation-visual');
    expect(await visual.getAttribute('aria-hidden')).toBe('true');
    const full = await $('.middle-truncation-full');
    expect(await full.getProperty('textContent')).toBe('quarterly-report-final-version-3.pdf');
  });

  it('should shorten the visual text in the middle, keeping the end', async function() {
    await browser.waitUntil(async () => (await (await $('.middle-truncation')).getAttribute('data-truncated')) !== null);
    const shown = await (await $('.middle-truncation-visual')).getProperty('textContent');
    expect(shown).toContain('…');
    expect(shown.endsWith('-3.pdf')).toBe(true);
    expect(shown.length).toBeLessThan('quarterly-report-final-version-3.pdf'.length);
  });

  it('should keep the ellipsis from data-ellipsis and set no default of its own', async function() {
    const root = await $('.middle-truncation');
    expect(await root.getAttribute('data-ellipsis')).toBe('…');
  });
});
