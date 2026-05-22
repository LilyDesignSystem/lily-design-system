import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BeachBall from './BeachBall.vue';

const meta = {
  title: 'Headless/BeachBall',
  component: BeachBall,
  tags: ['autodocs']
} satisfies Meta<typeof BeachBall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
