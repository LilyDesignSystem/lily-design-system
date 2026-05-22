import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AreaChart from './AreaChart';

const meta = {
  title: 'Examples/AreaChart',
  component: AreaChart,
  tags: ['autodocs']
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
