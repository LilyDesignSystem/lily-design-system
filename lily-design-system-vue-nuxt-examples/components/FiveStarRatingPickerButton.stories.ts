import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FiveStarRatingPickerButton from './FiveStarRatingPickerButton.vue';

const meta = {
  title: 'Examples/FiveStarRatingPickerButton',
  component: FiveStarRatingPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
