import type { Meta, StoryObj } from '@storybook/react-vite';
import KanbanTableTH from './KanbanTableTH';

const meta = {
  title: 'Headless/KanbanTableTH',
  component: KanbanTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
