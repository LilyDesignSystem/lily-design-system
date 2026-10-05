import type { Meta, StoryObj } from '@storybook/react-vite';
import HeatmapChart from './HeatmapChart';

const meta = {
  title: 'Headless/HeatmapChart',
  component: HeatmapChart,
  tags: ['autodocs']
} satisfies Meta<typeof HeatmapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', children: <svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg> }
};
