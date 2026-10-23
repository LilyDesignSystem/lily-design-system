import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HeatmapChartWithYearOfDays from './HeatmapChartWithYearOfDays.vue';

const meta = {
  title: 'Headless/HeatmapChartWithYearOfDays',
  component: HeatmapChartWithYearOfDays,
  tags: ['autodocs']
} satisfies Meta<typeof HeatmapChartWithYearOfDays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Chart", year: 2026, weekStart: 0 },
};
