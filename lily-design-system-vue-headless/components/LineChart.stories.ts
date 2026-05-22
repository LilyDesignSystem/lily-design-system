import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LineChart from './LineChart.vue';

const meta = {
  title: 'Headless/LineChart',
  component: LineChart,
  tags: ['autodocs']
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
