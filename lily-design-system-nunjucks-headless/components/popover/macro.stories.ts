import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="popover"
  id=""
  popover="auto"></div>`;

const meta = {
  title: 'Headless/Popover',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
