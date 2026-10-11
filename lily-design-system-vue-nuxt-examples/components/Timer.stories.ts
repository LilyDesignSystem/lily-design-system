import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Timer from './Timer.vue';

const meta = {
  title: 'Headless/Timer',
  component: Timer,
  tags: ['autodocs']
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
