import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FileManager from './FileManager.vue';

const meta = {
  title: 'Examples/FileManager',
  component: FileManager,
  tags: ['autodocs']
} satisfies Meta<typeof FileManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
