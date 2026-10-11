import type { Meta, StoryObj } from '@storybook/react-vite';
import ScatterChart from './ScatterChart';

const meta = {
  title: 'Headless/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs']
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
