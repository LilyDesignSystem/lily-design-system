import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="tree-list"
  role="tree"></ul>`;

const meta = {
  title: 'Headless/TreeList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
