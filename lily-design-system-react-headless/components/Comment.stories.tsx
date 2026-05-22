import type { Meta, StoryObj } from '@storybook/react-vite';
import Comment from './Comment';

const meta = {
  title: 'Headless/Comment',
  component: Comment,
  tags: ['autodocs']
} satisfies Meta<typeof Comment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
