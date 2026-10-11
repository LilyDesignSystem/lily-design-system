import type { Meta, StoryObj } from '@storybook/react-vite';
import SankeyChart from './SankeyChart';

const meta = {
  title: 'Headless/SankeyChart',
  component: SankeyChart,
  tags: ['autodocs']
} satisfies Meta<typeof SankeyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', children: <svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg> }
};
