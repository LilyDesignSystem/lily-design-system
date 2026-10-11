import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ComposedChart from './ComposedChart.vue';

const meta = {
  title: 'Headless/ComposedChart',
  component: ComposedChart,
  tags: ['autodocs']
} satisfies Meta<typeof ComposedChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
