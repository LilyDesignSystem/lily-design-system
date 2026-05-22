import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ProgressCircle from './ProgressCircle.vue';

const meta = {
  title: 'Headless/ProgressCircle',
  component: ProgressCircle,
  tags: ['autodocs']
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
