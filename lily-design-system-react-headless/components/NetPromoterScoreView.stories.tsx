import type { Meta, StoryObj } from '@storybook/react-vite';
import NetPromoterScoreView from './NetPromoterScoreView';

const meta = {
  title: 'Headless/NetPromoterScoreView',
  component: NetPromoterScoreView,
  tags: ['autodocs']
} satisfies Meta<typeof NetPromoterScoreView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
