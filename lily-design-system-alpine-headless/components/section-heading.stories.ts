import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SectionHeading component -->\n<!--\n  Description: a styled heading introducing a major content section, with optional eyebrow and subtitle\n  HTML tag: <header>\n  CSS class: section-heading\n  Keyboard: None (passive element)\n  Accessibility:\n    - <header> provides implicit landmark grouping for the heading set\n    - the heading element (<h2>–<h6>) sets the document outline; consumer chooses the level\n    - eyebrow and subtitle are paragraphs that complement (not replace) the heading\n  Usage:\n    <header class=\"section-heading\">\n      <p class=\"section-heading-eyebrow\">What's new</p>\n      <h2 class=\"section-heading-heading\">Latest releases</h2>\n      <p class=\"section-heading-subtitle\">A quick overview of recent work.</p>\n    </header>\n-->\n\n<header class=\"section-heading\">\n  <p class=\"section-heading-eyebrow\">\n    <!-- Consumer provides eyebrow text (optional) -->\n  </p>\n  <h2 class=\"section-heading-heading\">\n    <!-- Consumer provides heading text. Consumer may swap <h2> for <h3>–<h6>. -->\n  </h2>\n  <p class=\"section-heading-subtitle\">\n    <!-- Consumer provides subtitle text (optional) -->\n  </p>\n</header>";

const meta = {
  title: 'Headless/Section Heading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
