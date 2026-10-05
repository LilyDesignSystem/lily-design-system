import type { Meta, StoryObj } from '@storybook/react-vite';
import FunnelChart from './FunnelChart';

const meta = {
  title: 'Headless/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs']
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
