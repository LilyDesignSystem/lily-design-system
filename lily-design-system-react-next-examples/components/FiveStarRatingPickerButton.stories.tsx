import type { Meta, StoryObj } from '@storybook/react-vite';
import FiveStarRatingPickerButton from './FiveStarRatingPickerButton';

const meta = {
  title: 'Headless/FiveStarRatingPickerButton',
  component: FiveStarRatingPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingPickerButton>;

export default meta;
type Story = StoryObj<typeof FiveStarRatingPickerButton>;

export const Default: Story = {};
