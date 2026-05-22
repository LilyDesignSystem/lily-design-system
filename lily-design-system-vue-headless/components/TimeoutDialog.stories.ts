import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TimeoutDialog from './TimeoutDialog.vue';

const meta = {
  title: 'Headless/TimeoutDialog',
  component: TimeoutDialog,
  tags: ['autodocs']
} satisfies Meta<typeof TimeoutDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
