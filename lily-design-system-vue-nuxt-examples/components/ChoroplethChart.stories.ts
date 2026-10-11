import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ChoroplethChart from './ChoroplethChart.vue';

const meta = {
  title: 'Headless/ChoroplethChart',
  component: ChoroplethChart,
  tags: ['autodocs']
} satisfies Meta<typeof ChoroplethChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
