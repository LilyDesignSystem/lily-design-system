import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"cascader\" role=\"combobox\" aria-haspopup=\"tree\" aria-expanded=\"false\" aria-label=\"\" x-data=\"lilyCascader()\" x-bind=\"root\">\n  <button class=\"cascader-trigger\" x-bind=\"trigger\"><!-- Consumer provides the display value or placeholder text --></button>\n  <div class=\"cascader-panel\" hidden x-bind=\"panel\">\n    <ul class=\"cascader-list\" role=\"tree\" aria-label=\"\" x-bind=\"tree\">\n      <li role=\"treeitem\" class=\"cascader-option\" x-bind=\"item('one', true)\">\n        <!-- Consumer provides label -->\n        <ul role=\"group\" x-bind=\"group('one')\">\n          <li role=\"treeitem\" class=\"cascader-option\" x-bind=\"item('one-a')\"><!-- Consumer provides label --></li>\n          <li role=\"treeitem\" class=\"cascader-option\" x-bind=\"item('one-b')\"><!-- Consumer provides label --></li>\n        </ul>\n      </li>\n      <li role=\"treeitem\" class=\"cascader-option\" x-bind=\"item('two')\"><!-- Consumer provides label --></li>\n      <li role=\"treeitem\" class=\"cascader-option\" x-bind=\"item('three', true)\">\n        <!-- Consumer provides label -->\n        <ul role=\"group\" x-bind=\"group('three')\">\n          <li role=\"treeitem\" class=\"cascader-option\" x-bind=\"item('three-a')\"><!-- Consumer provides label --></li>\n        </ul>\n      </li>\n    </ul>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Cascader',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
