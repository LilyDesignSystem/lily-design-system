import type { Meta, StoryObj } from '@storybook/react-vite';
import GanttTableTfoot from './GanttTableTfoot';

const meta = {
  title: 'Headless/GanttTableTfoot',
  component: GanttTableTfoot,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTfoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
