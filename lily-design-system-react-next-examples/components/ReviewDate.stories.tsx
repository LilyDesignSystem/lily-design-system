import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ReviewDate from './ReviewDate';

const meta = {
  title: 'Examples/ReviewDate',
  component: ReviewDate,
  tags: ['autodocs']
} satisfies Meta<typeof ReviewDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
