import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PolskaPeselView from './PolskaPeselView.vue';

const meta = {
  title: 'Headless/PolskaPeselView',
  component: PolskaPeselView,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaPeselView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaPeselView' }
};
