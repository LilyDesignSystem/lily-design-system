import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TimerButton from './TimerButton.vue';

const meta = {
  title: 'Headless/TimerButton',
  component: TimerButton,
  tags: ['autodocs']
} satisfies Meta<typeof TimerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
