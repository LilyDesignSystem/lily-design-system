import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="file-tree"
  role="tree"
  aria-label="Files"
>
  <li role="treeitem" aria-expanded="true" data-id="src">src
    <ul role="group">
      <li role="treeitem" aria-expanded="true" data-id="lib">lib
        <ul role="group"><li role="treeitem" data-id="index">index.ts</li></ul>
      </li>
      <li role="treeitem" data-id="app">app.ts</li>
    </ul>
  </li>
  <li role="treeitem" aria-expanded="false" data-id="docs">docs
    <ul role="group"><li role="treeitem" data-id="guide">guide.md</li></ul>
  </li>
  <li role="treeitem" data-id="readme">readme.md</li>
  <li role="treeitem" aria-expanded="false" data-id="etc">etc
    <ul role="group"><li role="treeitem" data-id="x">x.txt</li></ul>
  </li>
</ul>`;

const meta = {
  title: 'Headless/FileTree',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
