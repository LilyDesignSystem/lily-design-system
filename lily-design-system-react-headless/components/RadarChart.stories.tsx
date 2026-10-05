import type { Meta, StoryObj } from '@storybook/react-vite';
import RadarChart from './RadarChart';

const meta = {
  title: 'Headless/RadarChart',
  component: RadarChart,
  tags: ['autodocs']
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', children: <svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg> }
};
