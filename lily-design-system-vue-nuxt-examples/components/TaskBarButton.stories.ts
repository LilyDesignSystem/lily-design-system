import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TaskBarButton from './TaskBarButton.vue';

const meta = {
  title: 'Headless/TaskBarButton',
  component: TaskBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof TaskBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
