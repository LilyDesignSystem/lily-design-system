import type { Meta, StoryObj } from '@storybook/react-vite';
import FiveFaceRatingView from './FiveFaceRatingView';

const meta = {
  title: 'Headless/FiveFaceRatingView',
  component: FiveFaceRatingView,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingView>;

export default meta;
type Story = StoryObj<typeof FiveFaceRatingView>;

export const Default: Story = {};
