import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Statistic from './Statistic';

const meta = {
  title: 'Examples/Statistic',
  component: Statistic,
  tags: ['autodocs']
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
