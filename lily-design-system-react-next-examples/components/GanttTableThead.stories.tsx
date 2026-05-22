import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GanttTableThead from './GanttTableThead';

const meta = {
  title: 'Examples/GanttTableThead',
  component: GanttTableThead,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableThead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
