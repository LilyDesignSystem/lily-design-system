import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GanttTableTD from './GanttTableTD.vue';

const meta = {
  title: 'Headless/GanttTableTD',
  component: GanttTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
