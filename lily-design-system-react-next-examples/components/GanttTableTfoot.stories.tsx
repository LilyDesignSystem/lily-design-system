import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GanttTableTfoot from './GanttTableTfoot';

const meta = {
  title: 'Examples/GanttTableTfoot',
  component: GanttTableTfoot,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTfoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
