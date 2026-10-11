import type { Meta, StoryObj } from '@storybook/react-vite';
import FiveFaceRatingPickerButton from './FiveFaceRatingPickerButton';

const meta = {
  title: 'Headless/FiveFaceRatingPickerButton',
  component: FiveFaceRatingPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
