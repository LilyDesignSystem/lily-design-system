import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TaskBar from './TaskBar.vue';

const meta = {
  title: 'Headless/TaskBar',
  component: TaskBar,
  tags: ['autodocs']
} satisfies Meta<typeof TaskBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
