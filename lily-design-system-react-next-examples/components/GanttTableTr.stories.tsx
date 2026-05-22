import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GanttTableTr from './GanttTableTr';

const meta = {
  title: 'Examples/GanttTableTr',
  component: GanttTableTr,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
