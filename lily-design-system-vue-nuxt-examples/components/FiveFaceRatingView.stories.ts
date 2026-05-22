import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FiveFaceRatingView from './FiveFaceRatingView.vue';

const meta = {
  title: 'Examples/FiveFaceRatingView',
  component: FiveFaceRatingView,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
