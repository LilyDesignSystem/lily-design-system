import type { Meta, StoryObj } from '@storybook/react-vite';
import KanbanTableBody from './KanbanTableBody';

const meta = {
  title: 'Headless/KanbanTableBody',
  component: KanbanTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
