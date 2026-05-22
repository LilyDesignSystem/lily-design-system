import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ReviewDate from './ReviewDate.vue';

const meta = {
  title: 'Headless/ReviewDate',
  component: ReviewDate,
  tags: ['autodocs']
} satisfies Meta<typeof ReviewDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
