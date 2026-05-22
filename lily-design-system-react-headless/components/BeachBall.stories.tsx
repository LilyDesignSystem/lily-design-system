import type { Meta, StoryObj } from '@storybook/react-vite';
import BeachBall from './BeachBall';

const meta = {
  title: 'Headless/BeachBall',
  component: BeachBall,
  tags: ['autodocs']
} satisfies Meta<typeof BeachBall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
