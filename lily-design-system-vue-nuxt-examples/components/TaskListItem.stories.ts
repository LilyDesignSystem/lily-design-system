import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TaskListItem from './TaskListItem.vue';

const meta = {
  title: 'Examples/TaskListItem',
  component: TaskListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TaskListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
