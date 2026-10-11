import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GaugeChart from './GaugeChart.vue';

const meta = {
  title: 'Headless/GaugeChart',
  component: GaugeChart,
  tags: ['autodocs']
} satisfies Meta<typeof GaugeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Chart" },
};
