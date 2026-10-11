import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RossiyaSnilsView from './RossiyaSnilsView.vue';

const meta = {
  title: 'Headless/RossiyaSnilsView',
  component: RossiyaSnilsView,
  tags: ['autodocs']
} satisfies Meta<typeof RossiyaSnilsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RossiyaSnilsView' }
};
