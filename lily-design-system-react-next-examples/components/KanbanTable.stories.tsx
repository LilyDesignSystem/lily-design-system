import type { Meta, StoryObj } from '@storybook/react-vite';
import KanbanTable from './KanbanTable';

const meta = {
  title: 'Headless/KanbanTable',
  component: KanbanTable,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
