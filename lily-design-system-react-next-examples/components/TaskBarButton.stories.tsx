import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TaskBarButton from './TaskBarButton';

const meta = {
  title: 'Examples/TaskBarButton',
  component: TaskBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof TaskBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
