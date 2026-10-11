import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GanttTableTr from './GanttTableTr.vue';

const meta = {
  title: 'Headless/GanttTableTr',
  component: GanttTableTr,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
