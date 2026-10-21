import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ul class=\"file-tree\" role=\"tree\" aria-label=\"\" x-data=\"lilyTree(false, ['src', 'lib'])\" x-bind=\"tree\">\n  <li role=\"treeitem\" x-bind=\"item('src', true)\">src\n    <ul role=\"group\" x-bind=\"group('src')\">\n      <li role=\"treeitem\" x-bind=\"item('lib', true)\">lib\n        <ul role=\"group\" x-bind=\"group('lib')\"><li role=\"treeitem\" x-bind=\"item('index')\">index.ts</li></ul>\n      </li>\n      <li role=\"treeitem\" x-bind=\"item('app')\">app.ts</li>\n    </ul>\n  </li>\n  <li role=\"treeitem\" x-bind=\"item('docs', true)\">docs\n    <ul role=\"group\" x-bind=\"group('docs')\"><li role=\"treeitem\" x-bind=\"item('guide')\">guide.md</li></ul>\n  </li>\n  <li role=\"treeitem\" x-bind=\"item('readme')\">readme.md</li>\n  <li role=\"treeitem\" x-bind=\"item('etc', true)\">etc\n    <ul role=\"group\" x-bind=\"group('etc')\"><li role=\"treeitem\" x-bind=\"item('x')\">x.txt</li></ul>\n  </li>\n</ul>";

const meta = {
  title: 'Headless/File Tree',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
