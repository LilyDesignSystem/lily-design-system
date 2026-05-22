import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="five-face-rating-view"
  role="img"
  data-value="3"
  aria-label="Rating: Neutral"></span>`;

const meta = {
  title: 'Headless/FiveFaceRatingView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
