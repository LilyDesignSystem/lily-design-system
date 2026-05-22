import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BarChart from './BarChart';

const meta = {
  title: 'Examples/BarChart',
  component: BarChart,
  tags: ['autodocs']
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
