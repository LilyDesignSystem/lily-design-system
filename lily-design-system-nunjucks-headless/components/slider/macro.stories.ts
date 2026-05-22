import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="slider"
  type="range"
  min="0"
  max="100"
  step="1"
  value="0">`;

const meta = {
  title: 'Headless/Slider',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
