import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="red-orange-yellow-green-blue-picker"
  role="radiogroup"></div>`;

const meta = {
  title: 'Headless/RedOrangeYellowGreenBluePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
