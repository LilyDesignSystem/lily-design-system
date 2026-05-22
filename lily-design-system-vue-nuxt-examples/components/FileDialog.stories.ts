import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FileDialog from './FileDialog.vue';

const meta = {
  title: 'Examples/FileDialog',
  component: FileDialog,
  tags: ['autodocs']
} satisfies Meta<typeof FileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
