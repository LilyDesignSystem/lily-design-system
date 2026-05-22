import type { Meta, StoryObj } from '@storybook/react-vite';
import Timer from './Timer';

const meta = {
  title: 'Headless/Timer',
  component: Timer,
  tags: ['autodocs']
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
