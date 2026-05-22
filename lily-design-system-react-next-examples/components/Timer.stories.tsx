import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Timer from './Timer';

const meta = {
  title: 'Examples/Timer',
  component: Timer,
  tags: ['autodocs']
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
