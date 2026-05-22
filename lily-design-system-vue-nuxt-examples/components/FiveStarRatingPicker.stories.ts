import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FiveStarRatingPicker from './FiveStarRatingPicker.vue';

const meta = {
  title: 'Examples/FiveStarRatingPicker',
  component: FiveStarRatingPicker,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
