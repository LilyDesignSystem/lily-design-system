import type { Meta, StoryObj } from '@storybook/react-vite';
import GanttTableTD from './GanttTableTD';

const meta = {
  title: 'Headless/GanttTableTD',
  component: GanttTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
