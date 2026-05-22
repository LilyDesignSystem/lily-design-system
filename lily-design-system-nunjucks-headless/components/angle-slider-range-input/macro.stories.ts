import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="angle-slider-range-input"
  type="range"
  min="0"
  max="360"
  step="1"
  value="0">`;

const meta = {
  title: 'Headless/AngleSliderRangeInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
