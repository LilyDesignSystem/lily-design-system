import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AlertDialog from './AlertDialog.vue';

const meta = {
  title: 'Headless/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs']
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
