import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Comment from './Comment.vue';

const meta = {
  title: 'Examples/Comment',
  component: Comment,
  tags: ['autodocs']
} satisfies Meta<typeof Comment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
