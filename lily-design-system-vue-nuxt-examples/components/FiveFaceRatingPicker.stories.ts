import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FiveFaceRatingPicker from './FiveFaceRatingPicker.vue';

const meta = {
  title: 'Headless/FiveFaceRatingPicker',
  component: FiveFaceRatingPicker,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
