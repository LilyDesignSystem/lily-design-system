import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NetPromoterScoreView from './NetPromoterScoreView.vue';

const meta = {
  title: 'Headless/NetPromoterScoreView',
  component: NetPromoterScoreView,
  tags: ['autodocs']
} satisfies Meta<typeof NetPromoterScoreView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
