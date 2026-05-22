import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Sonner from './Sonner.vue';

const meta = {
  title: 'Headless/Sonner',
  component: Sonner,
  tags: ['autodocs']
} satisfies Meta<typeof Sonner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
