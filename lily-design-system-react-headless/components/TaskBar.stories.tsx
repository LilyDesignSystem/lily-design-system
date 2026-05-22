import type { Meta, StoryObj } from '@storybook/react-vite';
import TaskBar from './TaskBar';

const meta = {
  title: 'Headless/TaskBar',
  component: TaskBar,
  tags: ['autodocs']
} satisfies Meta<typeof TaskBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
