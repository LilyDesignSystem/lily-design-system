// portugal-numero-de-identificacao-fiscal-input.test.js
// PortugalNumeroDeIdentificacaoFiscalInput component test

const path = require('path');

describe('PortugalNumeroDeIdentificacaoFiscalInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'portugal-numero-de-identificacao-fiscal-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.portugal-numero-de-identificacao-fiscal-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('portugal-numero-de-identificacao-fiscal-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.portugal-numero-de-identificacao-fiscal-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.portugal-numero-de-identificacao-fiscal-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
