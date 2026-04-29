// rating-and-feedback.test.js
// Rating and Feedback page test

const path = require('path');

describe('Rating and Feedback', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'rating-and-feedback.html'));
  });

  it('should render the feedback form', async function() {
    const el = await $('form.form');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Feedback form');
  });

  it('should render the five star rating picker', async function() {
    const el = await $('div.five-star-rating-picker#star-picker');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('radiogroup');
  });

  it('should render five star picker buttons', async function() {
    const buttons = await $$('button.five-star-rating-picker-button');
    expect(buttons.length).toBe(5);
  });

  it('should select a star on click', async function() {
    const stars = await $$('button.five-star-rating-picker-button');
    await stars[2].click();
    const checked = await stars[2].getAttribute('aria-checked');
    expect(checked).toBe('true');
  });

  it('should render the five face rating picker', async function() {
    const el = await $('div.five-face-rating-picker');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('radiogroup');
  });

  it('should render five face picker buttons', async function() {
    const buttons = await $$('button.five-face-rating-picker-button');
    expect(buttons.length).toBe(5);
  });

  it('should render the net promoter score picker', async function() {
    const el = await $('div.net-promoter-score-picker');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('radiogroup');
  });

  it('should render eleven NPS picker buttons', async function() {
    const buttons = await $$('button.net-promoter-score-picker-button');
    expect(buttons.length).toBe(11);
  });

  it('should render the comments textarea', async function() {
    const el = await $('textarea.textarea#comments');
    await expect(el).toExist();
  });

  it('should show success after form submission', async function() {
    const stars = await $$('button.five-star-rating-picker-button');
    await stars[3].click();
    await $('button[type="submit"]').click();
    const success = await $('div#success-section');
    const hidden = await success.getAttribute('hidden');
    expect(hidden).toBeNull();
  });
});
