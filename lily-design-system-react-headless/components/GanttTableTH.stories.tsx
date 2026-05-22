import type { Meta, StoryObj } from '@storybook/react-vite';
import GanttTableTH from './GanttTableTH';

const meta = {
  title: 'Headless/GanttTableTH',
  component: GanttTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
