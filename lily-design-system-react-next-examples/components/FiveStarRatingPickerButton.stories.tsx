import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FiveStarRatingPickerButton from './FiveStarRatingPickerButton';

const meta = {
  title: 'Examples/FiveStarRatingPickerButton',
  component: FiveStarRatingPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
