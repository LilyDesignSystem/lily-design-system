import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="comment"
></div>`;

const meta = {
  title: 'Headless/Comment',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
