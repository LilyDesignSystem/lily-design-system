import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PieChart from './PieChart.vue';

const meta = {
  title: 'Headless/PieChart',
  component: PieChart,
  tags: ['autodocs']
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
