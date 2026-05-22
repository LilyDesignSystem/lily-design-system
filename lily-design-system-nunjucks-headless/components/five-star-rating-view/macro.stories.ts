import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="five-star-rating-view"
  role="img"
  aria-label="Rating: 0 out of 5 stars"
  data-value="0"
  data-max="5"></span>`;

const meta = {
  title: 'Headless/FiveStarRatingView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
