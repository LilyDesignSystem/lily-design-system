import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FiveFaceRatingPicker from './FiveFaceRatingPicker';

const meta = {
  title: 'Examples/FiveFaceRatingPicker',
  component: FiveFaceRatingPicker,
  tags: ['autodocs']
} satisfies Meta<typeof FiveFaceRatingPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
