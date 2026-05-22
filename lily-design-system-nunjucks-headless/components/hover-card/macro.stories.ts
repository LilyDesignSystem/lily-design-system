import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="hover-card"
  role="tooltip"
  aria-label="" hidden></div>`;

const meta = {
  title: 'Headless/HoverCard',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
