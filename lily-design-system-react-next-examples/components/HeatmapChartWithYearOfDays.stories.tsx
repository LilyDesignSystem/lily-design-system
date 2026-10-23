import type { Meta, StoryObj } from '@storybook/react-vite';
import HeatmapChartWithYearOfDays from './HeatmapChartWithYearOfDays';

const meta = {
  title: 'Headless/HeatmapChartWithYearOfDays',
  component: HeatmapChartWithYearOfDays,
  tags: ['autodocs']
} satisfies Meta<typeof HeatmapChartWithYearOfDays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', year: 2026, weekStart: 0, children: <svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg> }
};
