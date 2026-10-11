import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GanttTableTH from './GanttTableTH.vue';

const meta = {
  title: 'Headless/GanttTableTH',
  component: GanttTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
