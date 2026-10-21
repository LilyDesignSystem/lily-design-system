import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<a\n  class=\"tree-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Tree Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
