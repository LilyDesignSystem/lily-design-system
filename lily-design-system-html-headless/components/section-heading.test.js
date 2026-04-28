// section-heading.test.js
// SectionHeading component test

const path = require('path');

describe('SectionHeading', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'section-heading.html'));
  });

  it('should render the header element with correct class', async function() {
    const el = await $('header.section-heading');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('section-heading');
  });

  it('should contain a heading element', async function() {
    const heading = await $('header.section-heading .section-heading-heading');
    await expect(heading).toExist();
    const tag = await heading.getTagName();
    // Default level is h2; consumer may override.
    expect(['h2', 'h3', 'h4', 'h5', 'h6']).toContain(tag);
  });

  it('should contain an eyebrow paragraph', async function() {
    const eyebrow = await $('header.section-heading p.section-heading-eyebrow');
    await expect(eyebrow).toExist();
  });

  it('should contain a subtitle paragraph', async function() {
    const subtitle = await $('header.section-heading p.section-heading-subtitle');
    await expect(subtitle).toExist();
  });
});
