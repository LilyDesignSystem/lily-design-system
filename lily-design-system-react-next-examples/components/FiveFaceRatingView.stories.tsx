import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FiveFaceRatingView from './FiveFaceRatingView';

const meta = {
  title: 'Examples/FiveFaceRatingView',
  component: FiveFaceRatingView,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
