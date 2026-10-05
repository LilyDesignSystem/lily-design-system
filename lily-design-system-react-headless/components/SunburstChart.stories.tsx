import type { Meta, StoryObj } from '@storybook/react-vite';
import SunburstChart from './SunburstChart';

const meta = {
  title: 'Headless/SunburstChart',
  component: SunburstChart,
  tags: ['autodocs']
} satisfies Meta<typeof SunburstChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
