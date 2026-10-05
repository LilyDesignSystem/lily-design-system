import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul class="file-tree" role="tree" data-module="file-tree" aria-label="Project files"><li role="treeitem" aria-expanded="true" tabindex="0">src<ul role="group"><li role="treeitem" tabindex="-1">index.js</li></ul></li><li role="treeitem" tabindex="-1">README</li></ul>`;

const meta = {
  title: 'Headless/FileTree',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
