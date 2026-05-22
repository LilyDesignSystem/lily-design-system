import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Toast from './Toast.vue';

const meta = {
  title: 'Examples/Toast',
  component: Toast,
  tags: ['autodocs']
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
