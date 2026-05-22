import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="tooltip"
  role="tooltip"
  id="" hidden></span>`;

const meta = {
  title: 'Headless/Tooltip',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
