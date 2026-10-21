import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<nav class=\"tree-nav\" aria-label=\"\" x-data=\"lilyTree()\">\n  <ul class=\"tree-list\" role=\"tree\" aria-label=\"\" x-bind=\"tree\">\n    <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('one', true)\">\n      <!-- Consumer provides label -->\n      <ul role=\"group\" x-bind=\"group('one')\">\n        <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('one-a')\"><!-- Consumer provides label --></li>\n        <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('one-b')\"><!-- Consumer provides label --></li>\n      </ul>\n    </li>\n    <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('two')\"><!-- Consumer provides label --></li>\n    <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('three', true)\">\n      <!-- Consumer provides label -->\n      <ul role=\"group\" x-bind=\"group('three')\">\n        <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('three-a')\"><!-- Consumer provides label --></li>\n      </ul>\n    </li>\n  </ul>\n</nav>";

const meta = {
  title: 'Headless/Tree Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
