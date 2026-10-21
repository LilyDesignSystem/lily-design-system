import type { Meta, StoryObj } from '@storybook/react-vite';
import GanttTableThead from './GanttTableThead';

const meta = {
  title: 'Headless/GanttTableThead',
  component: GanttTableThead,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableThead>;

export default meta;
type Story = StoryObj<typeof GanttTableThead>;

export const Default: Story = {};
