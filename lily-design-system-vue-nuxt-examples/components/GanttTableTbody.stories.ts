import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GanttTableTbody from './GanttTableTbody.vue';

const meta = {
  title: 'Examples/GanttTableTbody',
  component: GanttTableTbody,
  tags: ['autodocs']
} satisfies Meta<typeof GanttTableTbody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
