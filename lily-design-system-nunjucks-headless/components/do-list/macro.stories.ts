import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="do-list"></ul>`;

const meta = {
  title: 'Headless/DoList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
