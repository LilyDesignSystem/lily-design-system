import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ProgressBar from './ProgressBar.vue';

const meta = {
  title: 'Headless/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs']
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
