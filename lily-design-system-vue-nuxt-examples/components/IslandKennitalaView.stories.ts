import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IslandKennitalaView from './IslandKennitalaView.vue';

const meta = {
  title: 'Headless/IslandKennitalaView',
  component: IslandKennitalaView,
  tags: ['autodocs']
} satisfies Meta<typeof IslandKennitalaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'IslandKennitalaView' }
};
