import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FiveFaceRatingPickerButton from './FiveFaceRatingPickerButton.vue';

const meta = {
  title: 'Examples/FiveFaceRatingPickerButton',
  component: FiveFaceRatingPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
