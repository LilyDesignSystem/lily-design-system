import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ol role=\"tree\"><li class=\"tree-list-item\" role=\"treeitem\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Tree List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
