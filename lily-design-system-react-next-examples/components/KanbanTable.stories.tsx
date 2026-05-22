import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import KanbanTable from './KanbanTable';

const meta = {
  title: 'Examples/KanbanTable',
  component: KanbanTable,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
