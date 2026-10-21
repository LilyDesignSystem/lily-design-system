import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"angle-slider-range-input\"\n  type=\"range\"\n  aria-label=\"\"\n  min=\"0\"\n  max=\"360\"\n  step=\"1\"\n>";

const meta = {
  title: 'Headless/Angle Slider Range Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
