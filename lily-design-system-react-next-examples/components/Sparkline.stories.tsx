import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Sparkline from './Sparkline';

const meta = {
  title: 'Examples/Sparkline',
  component: Sparkline,
  tags: ['autodocs']
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
