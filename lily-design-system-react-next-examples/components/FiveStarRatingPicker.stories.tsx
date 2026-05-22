import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FiveStarRatingPicker from './FiveStarRatingPicker';

const meta = {
  title: 'Examples/FiveStarRatingPicker',
  component: FiveStarRatingPicker,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
