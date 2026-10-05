// chat-composer.test.js
// ChatComposer component test

const path = require('path');

describe('ChatComposer', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'chat-composer.html'));
  });

  it('should render a form with the base class as its first class', async function() {
    const el = await $('form.chat-composer');
    await expect(el).toExist();
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('chat-composer');
  });

  it('should have a named textarea', async function() {
    const t = await $('form.chat-composer textarea.chat-composer-input');
    expect(await t.getAttribute('aria-label')).toBe('Message');
  });

  it('should have one button per form: send, disabled while empty', async function() {
    const b = await $('form.chat-composer:not(#chat-composer-busy) button.chat-composer-button');
    expect(await b.getAttribute('type')).toBe('submit');
    expect(await b.getAttribute('data-state')).toBe('send');
    expect(await b.getAttribute('disabled')).not.toBeNull();
    expect(await b.getText()).toBe('Send');
  });

  it('should render stop while busy', async function() {
    const b = await $('#chat-composer-busy button.chat-composer-button');
    expect(await b.getAttribute('type')).toBe('button');
    expect(await b.getAttribute('data-state')).toBe('stop');
    expect(await b.getText()).toBe('Stop');
  });

  it('should not ship inline styles', async function() {
    expect(await (await $('form.chat-composer')).getAttribute('style')).toBeNull();
  });
});
