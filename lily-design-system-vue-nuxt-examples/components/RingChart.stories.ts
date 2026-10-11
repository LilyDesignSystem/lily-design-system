import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RingChart from './RingChart.vue';

const meta = {
  title: 'Headless/RingChart',
  component: RingChart,
  tags: ['autodocs']
} satisfies Meta<typeof RingChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
