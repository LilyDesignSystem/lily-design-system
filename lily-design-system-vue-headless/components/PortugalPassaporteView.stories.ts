import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PortugalPassaporteView from './PortugalPassaporteView.vue';

const meta = {
  title: 'Headless/PortugalPassaporteView',
  component: PortugalPassaporteView,
  tags: ['autodocs']
} satisfies Meta<typeof PortugalPassaporteView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PortugalPassaporteView' }
};
