import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="tree-list-item"
  role="treeitem"></li>`;

const meta = {
  title: 'Headless/TreeListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
