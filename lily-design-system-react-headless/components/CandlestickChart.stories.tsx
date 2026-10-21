import type { Meta, StoryObj } from '@storybook/react-vite';
import CandlestickChart from './CandlestickChart';

const meta = {
  title: 'Headless/CandlestickChart',
  component: CandlestickChart,
  tags: ['autodocs']
} satisfies Meta<typeof CandlestickChart>;

export default meta;
type Story = StoryObj<typeof CandlestickChart>;

export const Default: Story = {};
