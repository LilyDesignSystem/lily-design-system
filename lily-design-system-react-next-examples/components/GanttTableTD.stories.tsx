import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GanttTableTD from './GanttTableTD';

const meta = {
  title: 'Examples/GanttTableTD',
  component: GanttTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
