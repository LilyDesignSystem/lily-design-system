import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScatterChart from './ScatterChart.vue';

const meta = {
  title: 'Headless/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs']
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
