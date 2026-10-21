import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Blockquote component -->\n<!--\n  Description: a block-level quotation with optional source citation\n  HTML tag: <blockquote>\n  CSS class: blockquote\n  Keyboard: None (passive element)\n  Accessibility:\n    - implicit <blockquote> semantics\n    - optional aria-label override for the quotation\n    - cite attribute may carry the URL of the source\n    - <footer class=\"blockquote-citation\"> holds the visible attribution text\n  Usage:\n    <blockquote\n      class=\"blockquote\"\n      cite=\"https://example.com/source\"\n      aria-label=\"Quotation\"\n    >\n      <p>Quote text goes here.</p>\n      <footer class=\"blockquote-citation\">— Author Name, Source</footer>\n    </blockquote>\n-->\n\n<blockquote\n  class=\"blockquote\"\n  cite=\"\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides quotation content -->\n  <footer class=\"blockquote-citation\">\n    <!-- Consumer provides citation text (e.g., \"— Author Name, Source\") -->\n  </footer>\n</blockquote>";

const meta = {
  title: 'Headless/Blockquote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
