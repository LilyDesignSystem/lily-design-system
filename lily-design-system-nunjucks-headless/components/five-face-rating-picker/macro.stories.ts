import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="five-face-rating-picker"
  role="radiogroup" aria-label="Satisfaction rating"></div>`;

const meta = {
  title: 'Headless/FiveFaceRatingPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
