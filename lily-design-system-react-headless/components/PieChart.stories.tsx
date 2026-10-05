import type { Meta, StoryObj } from '@storybook/react-vite';
import PieChart from './PieChart';

const meta = {
  title: 'Headless/PieChart',
  component: PieChart,
  tags: ['autodocs']
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
