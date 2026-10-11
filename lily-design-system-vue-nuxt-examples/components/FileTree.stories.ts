import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FileTree from './FileTree.vue';

const meta = {
  title: 'Headless/FileTree',
  component: FileTree,
  tags: ['autodocs']
} satisfies Meta<typeof FileTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Files' },
};
