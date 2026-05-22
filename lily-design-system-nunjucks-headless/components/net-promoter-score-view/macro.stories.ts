import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="net-promoter-score-view"
  data-value="0"
  data-category="detractor"
  aria-label="Net Promoter Score: 0 — Detractor">
  <span class="net-promoter-score-view-value">0</span>
  <span class="net-promoter-score-view-category">Detractor</span>
</span>`;

const meta = {
  title: 'Headless/NetPromoterScoreView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
