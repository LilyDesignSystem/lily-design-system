import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="five-face-rating-picker-button"
  type="button"
  role="radio"
  aria-checked="false"
  aria-label="Neutral"
  tabindex="-1"
  data-value=""></button>`;

const meta = {
  title: 'Headless/FiveFaceRatingPickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
