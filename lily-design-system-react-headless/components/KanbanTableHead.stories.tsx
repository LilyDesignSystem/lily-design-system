import type { Meta, StoryObj } from '@storybook/react-vite';
import KanbanTableHead from './KanbanTableHead';

const meta = {
  title: 'Headless/KanbanTableHead',
  component: KanbanTableHead,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
