import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Sparkline from './Sparkline.vue';

const meta = {
  title: 'Headless/Sparkline',
  component: Sparkline,
  tags: ['autodocs']
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
