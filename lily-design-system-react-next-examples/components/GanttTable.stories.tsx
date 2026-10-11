import type { Meta, StoryObj } from '@storybook/react-vite';
import GanttTable from './GanttTable';

const meta = {
  title: 'Headless/GanttTable',
  component: GanttTable,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
