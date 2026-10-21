import type { Meta, StoryObj } from '@storybook/react-vite';
import FiveFaceRatingPicker from './FiveFaceRatingPicker';

const meta = {
  title: 'Headless/FiveFaceRatingPicker',
  component: FiveFaceRatingPicker,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingPicker>;

export default meta;
type Story = StoryObj<typeof FiveFaceRatingPicker>;

export const Default: Story = {};
