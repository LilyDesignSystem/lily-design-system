import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BarChart from './BarChart.vue';

const meta = {
  title: 'Headless/BarChart',
  component: BarChart,
  tags: ['autodocs']
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
