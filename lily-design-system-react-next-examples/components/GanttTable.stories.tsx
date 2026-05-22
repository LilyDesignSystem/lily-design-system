import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GanttTable from './GanttTable';

const meta = {
  title: 'Examples/GanttTable',
  component: GanttTable,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
