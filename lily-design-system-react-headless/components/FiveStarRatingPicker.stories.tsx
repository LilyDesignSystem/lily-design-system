import type { Meta, StoryObj } from '@storybook/react-vite';
import FiveStarRatingPicker from './FiveStarRatingPicker';

const meta = {
  title: 'Headless/FiveStarRatingPicker',
  component: FiveStarRatingPicker,
  tags: ['autodocs']
} satisfies Meta<typeof FiveStarRatingPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
