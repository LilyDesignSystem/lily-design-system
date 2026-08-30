import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EestiIsikukoodView from './EestiIsikukoodView.vue';

const meta = {
  title: 'Examples/EestiIsikukoodView',
  component: EestiIsikukoodView,
  tags: ['autodocs']
} satisfies Meta<typeof EestiIsikukoodView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EestiIsikukoodView' }
};
