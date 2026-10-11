import type { Meta, StoryObj } from '@storybook/react-vite';
import FileTree from './FileTree';

const meta = {
  title: 'Headless/FileTree',
  component: FileTree,
  tags: ['autodocs']
} satisfies Meta<typeof FileTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Files", children: <li role="treeitem">readme.md</li> }
};
