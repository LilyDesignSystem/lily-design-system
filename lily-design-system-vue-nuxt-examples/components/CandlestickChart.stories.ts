import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CandlestickChart from './CandlestickChart.vue';

const meta = {
  title: 'Headless/CandlestickChart',
  component: CandlestickChart,
  tags: ['autodocs']
} satisfies Meta<typeof CandlestickChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
