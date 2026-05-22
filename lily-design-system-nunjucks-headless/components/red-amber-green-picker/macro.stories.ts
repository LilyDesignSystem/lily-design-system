import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="red-amber-green-picker"
  role="radiogroup"></div>`;

const meta = {
  title: 'Headless/RedAmberGreenPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
