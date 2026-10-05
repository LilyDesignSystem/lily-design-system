import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FunnelChart from './FunnelChart.vue';

const meta = {
  title: 'Headless/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs']
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
