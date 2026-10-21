import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ol\n  class=\"tree-list\"\n  role=\"tree\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Tree List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
