import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ColumnChart from './ColumnChart.vue';

const meta = {
  title: 'Examples/ColumnChart',
  component: ColumnChart,
  tags: ['autodocs']
} satisfies Meta<typeof ColumnChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
