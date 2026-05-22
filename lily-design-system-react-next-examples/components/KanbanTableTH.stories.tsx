import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import KanbanTableTH from './KanbanTableTH';

const meta = {
  title: 'Examples/KanbanTableTH',
  component: KanbanTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
