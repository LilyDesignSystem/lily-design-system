import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<blockquote\n  class=\"blockquote\"\n  cite=\"\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides quotation content -->\n  <footer class=\"blockquote-citation\">\n    <!-- Consumer provides citation text (e.g., \"— Author Name, Source\") -->\n  </footer>\n</blockquote>";

const meta = {
  title: 'Headless/Blockquote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
