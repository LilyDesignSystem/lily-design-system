import type { Meta, StoryObj } from '@storybook/react-vite';
import ComposedChart from './ComposedChart';

const meta = {
  title: 'Headless/ComposedChart',
  component: ComposedChart,
  tags: ['autodocs']
} satisfies Meta<typeof ComposedChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
