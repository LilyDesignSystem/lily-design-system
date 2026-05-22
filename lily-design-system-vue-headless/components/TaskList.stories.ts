import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TaskList from './TaskList.vue';

const meta = {
  title: 'Headless/TaskList',
  component: TaskList,
  tags: ['autodocs']
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
