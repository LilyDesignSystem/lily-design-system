import type { Meta, StoryObj } from '@storybook/react-vite';
import GanttTableTr from './GanttTableTr';

const meta = {
  title: 'Headless/GanttTableTr',
  component: GanttTableTr,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
