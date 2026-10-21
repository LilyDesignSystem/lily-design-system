import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"tree-select\" role=\"combobox\" aria-haspopup=\"tree\" aria-expanded=\"false\" aria-label=\"\" x-data=\"lilyTreeSelect()\" x-bind=\"root\">\n  <button class=\"tree-select-trigger\" x-bind=\"trigger\"><!-- Consumer provides the display value or placeholder text --></button>\n  <div class=\"tree-select-panel\" hidden x-bind=\"panel\">\n    <ul class=\"tree-list\" role=\"tree\" aria-label=\"\" x-bind=\"tree\">\n      <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('one', true)\">\n        <!-- Consumer provides label -->\n        <ul role=\"group\" x-bind=\"group('one')\">\n          <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('one-a')\"><!-- Consumer provides label --></li>\n          <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('one-b')\"><!-- Consumer provides label --></li>\n        </ul>\n      </li>\n      <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('two')\"><!-- Consumer provides label --></li>\n      <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('three', true)\">\n        <!-- Consumer provides label -->\n        <ul role=\"group\" x-bind=\"group('three')\">\n          <li role=\"treeitem\" class=\"tree-list-item\" x-bind=\"item('three-a')\"><!-- Consumer provides label --></li>\n        </ul>\n      </li>\n    </ul>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Tree Select',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
