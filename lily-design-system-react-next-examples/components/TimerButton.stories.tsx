import type { Meta, StoryObj } from '@storybook/react-vite';
import TimerButton from './TimerButton';

const meta = {
  title: 'Headless/TimerButton',
  component: TimerButton,
  tags: ['autodocs']
} satisfies Meta<typeof TimerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
