import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Always inside a lilyTabs scope: see tab-bar.html -->\n<div x-data=\"lilyTabs('one')\">\n  <div role=\"tablist\" aria-label=\"\" x-bind=\"tablist\">\n    <button x-bind=\"tab('one')\"><!-- Consumer provides tab label --></button>\n    <button x-bind=\"tab('two')\"><!-- Consumer provides tab label --></button>\n  </div>\n  <div class=\"tab-panel\" x-bind=\"panel('one')\"><!-- Consumer provides panel content --></div>\n  <div class=\"tab-panel\" x-bind=\"panel('two')\"><!-- Consumer provides panel content --></div>\n</div>";

const meta = {
  title: 'Headless/Tab Panel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
