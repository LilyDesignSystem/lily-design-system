import type { Meta, StoryObj } from '@storybook/react-vite';
import KanbanTableRow from './KanbanTableRow';

const meta = {
  title: 'Headless/KanbanTableRow',
  component: KanbanTableRow,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
