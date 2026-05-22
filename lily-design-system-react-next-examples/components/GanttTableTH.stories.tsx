import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GanttTableTH from './GanttTableTH';

const meta = {
  title: 'Examples/GanttTableTH',
  component: GanttTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
