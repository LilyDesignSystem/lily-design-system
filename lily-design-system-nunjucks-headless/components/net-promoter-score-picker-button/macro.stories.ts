import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="net-promoter-score-picker-button"
  type="button"
  role="radio"
  aria-checked="false"
  aria-label="Rate undefined out of 10"
  tabindex="-1"
  data-value=""
  data-category="detractor"></button>`;

const meta = {
  title: 'Headless/NetPromoterScorePickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
