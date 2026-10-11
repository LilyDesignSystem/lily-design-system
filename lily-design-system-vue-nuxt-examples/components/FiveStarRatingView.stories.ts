import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FiveStarRatingView from './FiveStarRatingView.vue';

const meta = {
  title: 'Headless/FiveStarRatingView',
  component: FiveStarRatingView,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
