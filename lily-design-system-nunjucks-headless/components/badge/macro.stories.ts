import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="badge"></span>`;

const meta = {
  title: 'Headless/Badge',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
