import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ContentsLink component -->\n<!--\n  Description: one table of contents link\n  HTML tag: <a>\n  CSS class: contents-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n  Count (optional): put a visible count INSIDE the link, after the text, so the link's accessible name\n    includes it, e.g. <span class=\"contents-link-count\">3 to do</span>. Add data-count=\"3\" (and\n    data-complete when it is 0) as CSS hooks. The count is text, never colour alone (WCAG 1.4.1). An\n    aria-label replaces the whole name, so if you set one, include the count in it.\n-->\n\n<a\n  class=\"contents-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>\n\n<!-- With a count: the visible count sits inside the link, after the text. -->\n<a\n  class=\"contents-link\"\n  id=\"with-count\"\n  href=\"#address\"\n  data-count=\"3\"\n>\n  Address\n  <span class=\"contents-link-count\">3 to do</span>\n</a>";

const meta = {
  title: 'Headless/Contents Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
