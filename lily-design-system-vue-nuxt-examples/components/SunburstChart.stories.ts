import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SunburstChart from './SunburstChart.vue';

const meta = {
  title: 'Headless/SunburstChart',
  component: SunburstChart,
  tags: ['autodocs']
} satisfies Meta<typeof SunburstChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
