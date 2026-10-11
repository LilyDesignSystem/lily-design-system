import type { Meta, StoryObj } from '@storybook/react-vite';
import GanttTableTbody from './GanttTableTbody';

const meta = {
  title: 'Headless/GanttTableTbody',
  component: GanttTableTbody,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTbody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
