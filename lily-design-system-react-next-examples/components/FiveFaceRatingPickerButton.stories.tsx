import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FiveFaceRatingPickerButton from './FiveFaceRatingPickerButton';

const meta = {
  title: 'Examples/FiveFaceRatingPickerButton',
  component: FiveFaceRatingPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
