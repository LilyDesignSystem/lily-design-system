import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TaskListItem from './TaskListItem';

const meta = {
  title: 'Examples/TaskListItem',
  component: TaskListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TaskListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
