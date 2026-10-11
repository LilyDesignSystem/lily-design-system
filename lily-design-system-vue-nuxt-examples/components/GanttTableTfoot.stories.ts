import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GanttTableTfoot from './GanttTableTfoot.vue';

const meta = {
  title: 'Headless/GanttTableTfoot',
  component: GanttTableTfoot,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTfoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
