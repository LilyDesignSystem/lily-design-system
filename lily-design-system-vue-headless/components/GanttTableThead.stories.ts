import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GanttTableThead from './GanttTableThead.vue';

const meta = {
  title: 'Headless/GanttTableThead',
  component: GanttTableThead,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableThead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
