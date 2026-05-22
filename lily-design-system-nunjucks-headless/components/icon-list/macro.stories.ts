import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="icon-list"></ul>`;

const meta = {
  title: 'Headless/IconList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
