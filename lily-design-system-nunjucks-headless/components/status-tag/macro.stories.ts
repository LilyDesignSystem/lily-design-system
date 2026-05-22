import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="status-tag"></span>`;

const meta = {
  title: 'Headless/StatusTag',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
