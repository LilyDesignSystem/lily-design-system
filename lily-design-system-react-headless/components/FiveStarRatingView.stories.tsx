import type { Meta, StoryObj } from '@storybook/react-vite';
import FiveStarRatingView from './FiveStarRatingView';

const meta = {
  title: 'Headless/FiveStarRatingView',
  component: FiveStarRatingView,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
