import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import KanbanTableTD from './KanbanTableTD';

const meta = {
  title: 'Examples/KanbanTableTD',
  component: KanbanTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
