import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FiveStarRatingView from './FiveStarRatingView';

const meta = {
  title: 'Examples/FiveStarRatingView',
  component: FiveStarRatingView,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
