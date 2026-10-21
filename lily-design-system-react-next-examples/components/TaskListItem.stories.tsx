import type { Meta, StoryObj } from '@storybook/react-vite';
import TaskListItem from './TaskListItem';

const meta = {
  title: 'Headless/TaskListItem',
  component: TaskListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TaskListItem>;

export default meta;
type Story = StoryObj<typeof TaskListItem>;

export const Default: Story = {};
