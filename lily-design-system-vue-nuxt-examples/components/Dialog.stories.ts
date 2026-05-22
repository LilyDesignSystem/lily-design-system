import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Dialog from './Dialog.vue';

const meta = {
  title: 'Examples/Dialog',
  component: Dialog,
  tags: ['autodocs']
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
