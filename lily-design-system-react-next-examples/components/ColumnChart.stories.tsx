import type { Meta, StoryObj } from '@storybook/react-vite';
import ColumnChart from './ColumnChart';

const meta = {
  title: 'Headless/ColumnChart',
  component: ColumnChart,
  tags: ['autodocs']
} satisfies Meta<typeof ColumnChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
