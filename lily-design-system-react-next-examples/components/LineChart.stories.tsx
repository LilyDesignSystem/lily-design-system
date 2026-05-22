import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LineChart from './LineChart';

const meta = {
  title: 'Examples/LineChart',
  component: LineChart,
  tags: ['autodocs']
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
