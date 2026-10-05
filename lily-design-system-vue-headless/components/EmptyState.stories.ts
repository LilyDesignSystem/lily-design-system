import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EmptyState from './EmptyState.vue';

const meta = {
  title: 'Headless/EmptyState',
  component: EmptyState,
  tags: ['autodocs']
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  
};
