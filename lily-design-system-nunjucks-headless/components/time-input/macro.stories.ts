import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="time-input"
  type="time"
  id=""
  name=""
  value="">`;

const meta = {
  title: 'Headless/TimeInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
