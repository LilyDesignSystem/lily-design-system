import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NetPromoterScoreView from './NetPromoterScoreView';

const meta = {
  title: 'Examples/NetPromoterScoreView',
  component: NetPromoterScoreView,
  tags: ['autodocs']
} satisfies Meta<typeof NetPromoterScoreView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
