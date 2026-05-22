import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TimerButton from './TimerButton';

const meta = {
  title: 'Examples/TimerButton',
  component: TimerButton,
  tags: ['autodocs']
} satisfies Meta<typeof TimerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
