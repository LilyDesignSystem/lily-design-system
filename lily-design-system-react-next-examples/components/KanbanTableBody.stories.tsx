import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import KanbanTableBody from './KanbanTableBody';

const meta = {
  title: 'Examples/KanbanTableBody',
  component: KanbanTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
