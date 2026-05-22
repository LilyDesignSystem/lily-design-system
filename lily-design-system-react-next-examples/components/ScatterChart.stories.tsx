import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScatterChart from './ScatterChart';

const meta = {
  title: 'Examples/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs']
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
