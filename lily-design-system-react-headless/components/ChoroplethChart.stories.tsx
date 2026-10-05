import type { Meta, StoryObj } from '@storybook/react-vite';
import ChoroplethChart from './ChoroplethChart';

const meta = {
  title: 'Headless/ChoroplethChart',
  component: ChoroplethChart,
  tags: ['autodocs']
} satisfies Meta<typeof ChoroplethChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
