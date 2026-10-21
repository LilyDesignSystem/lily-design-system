import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ul class=\"tree-menu\" role=\"tree\" aria-label=\"\" x-data=\"lilyTree(true)\" x-bind=\"tree\">\n  <li role=\"treeitem\" class=\"tree-menu-item\" x-bind=\"item('one', true)\">\n    <!-- Consumer provides label -->\n    <ul role=\"group\" x-bind=\"group('one')\">\n      <li role=\"treeitem\" class=\"tree-menu-item\" x-bind=\"item('one-a')\"><!-- Consumer provides label --></li>\n      <li role=\"treeitem\" class=\"tree-menu-item\" x-bind=\"item('one-b')\"><!-- Consumer provides label --></li>\n    </ul>\n  </li>\n  <li role=\"treeitem\" class=\"tree-menu-item\" x-bind=\"item('two')\"><!-- Consumer provides label --></li>\n  <li role=\"treeitem\" class=\"tree-menu-item\" x-bind=\"item('three', true)\">\n    <!-- Consumer provides label -->\n    <ul role=\"group\" x-bind=\"group('three')\">\n      <li role=\"treeitem\" class=\"tree-menu-item\" x-bind=\"item('three-a')\"><!-- Consumer provides label --></li>\n    </ul>\n  </li>\n</ul>";

const meta = {
  title: 'Headless/Tree Menu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
