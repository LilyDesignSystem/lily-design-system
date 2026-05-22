import type { Meta, StoryObj } from '@storybook/react-vite';
import KanbanTableFoot from './KanbanTableFoot';

const meta = {
  title: 'Headless/KanbanTableFoot',
  component: KanbanTableFoot,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableFoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
