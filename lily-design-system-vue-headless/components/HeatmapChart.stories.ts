import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HeatmapChart from './HeatmapChart.vue';

const meta = {
  title: 'Headless/HeatmapChart',
  component: HeatmapChart,
  tags: ['autodocs']
} satisfies Meta<typeof HeatmapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Chart" },
};
