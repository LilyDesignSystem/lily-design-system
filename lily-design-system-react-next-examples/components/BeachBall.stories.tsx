import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BeachBall from './BeachBall';

const meta = {
  title: 'Examples/BeachBall',
  component: BeachBall,
  tags: ['autodocs']
} satisfies Meta<typeof BeachBall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
