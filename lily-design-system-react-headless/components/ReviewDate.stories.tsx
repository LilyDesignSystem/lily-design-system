import type { Meta, StoryObj } from '@storybook/react-vite';
import ReviewDate from './ReviewDate';

const meta = {
  title: 'Headless/ReviewDate',
  component: ReviewDate,
  tags: ['autodocs']
} satisfies Meta<typeof ReviewDate>;

export default meta;
type Story = StoryObj<typeof ReviewDate>;

export const Default: Story = {};
