import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="five-star-rating-picker-button"
  type="button"
  role="radio"
  aria-checked="false"
  aria-label="Rate undefined stars"
  tabindex="-1"
  data-value=""></button>`;

const meta = {
  title: 'Headless/FiveStarRatingPickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
