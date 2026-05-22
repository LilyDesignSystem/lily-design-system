import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TaskList from './TaskList';

const meta = {
  title: 'Examples/TaskList',
  component: TaskList,
  tags: ['autodocs']
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
