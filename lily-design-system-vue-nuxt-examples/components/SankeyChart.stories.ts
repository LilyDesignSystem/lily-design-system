import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SankeyChart from './SankeyChart.vue';

const meta = {
  title: 'Headless/SankeyChart',
  component: SankeyChart,
  tags: ['autodocs']
} satisfies Meta<typeof SankeyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Chart" },
};
