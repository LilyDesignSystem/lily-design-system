import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GanttTable from './GanttTable.vue';

const meta = {
  title: 'Examples/GanttTable',
  component: GanttTable,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
