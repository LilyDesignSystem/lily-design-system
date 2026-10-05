import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RadarChart from './RadarChart.vue';

const meta = {
  title: 'Headless/RadarChart',
  component: RadarChart,
  tags: ['autodocs']
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Chart" },
};
