import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PopconfirmDialog from './PopconfirmDialog.vue';

const meta = {
  title: 'Headless/PopconfirmDialog',
  component: PopconfirmDialog,
  tags: ['autodocs']
} satisfies Meta<typeof PopconfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
