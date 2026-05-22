import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="time-picker-input"
  type="time"
  value="">`;

const meta = {
  title: 'Headless/TimePickerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
