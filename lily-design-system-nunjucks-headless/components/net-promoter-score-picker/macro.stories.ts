import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="net-promoter-score-picker"
  role="radiogroup" aria-label="Net Promoter Score"></div>`;

const meta = {
  title: 'Headless/NetPromoterScorePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
