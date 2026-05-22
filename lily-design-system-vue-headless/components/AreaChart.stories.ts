import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AreaChart from './AreaChart.vue';

const meta = {
  title: 'Headless/AreaChart',
  component: AreaChart,
  tags: ['autodocs']
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
