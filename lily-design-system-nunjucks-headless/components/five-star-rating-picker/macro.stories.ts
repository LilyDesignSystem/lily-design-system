import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="five-star-rating-picker"
  role="radiogroup" aria-label="Rate out of 5"></div>`;

const meta = {
  title: 'Headless/FiveStarRatingPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
