import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<a\n  class=\"contents-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>\n\n<!-- With a count: the visible count sits inside the link, after the text. -->\n<a\n  class=\"contents-link\"\n  id=\"with-count\"\n  href=\"#address\"\n  data-count=\"3\"\n>\n  Address\n  <span class=\"contents-link-count\">3 to do</span>\n</a>";

const meta = {
  title: 'Headless/Contents Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
