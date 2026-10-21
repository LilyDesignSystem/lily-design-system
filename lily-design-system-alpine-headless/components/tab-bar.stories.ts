import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"tabs\" x-data=\"lilyTabs('one')\">\n  <div class=\"tab-bar\" role=\"tablist\" aria-label=\"\" x-bind=\"tablist\">\n    <button class=\"tab-bar-button\" x-bind=\"tab('one')\"><!-- Consumer provides tab label --></button>\n    <button class=\"tab-bar-button\" x-bind=\"tab('two')\"><!-- Consumer provides tab label --></button>\n    <button class=\"tab-bar-button\" x-bind=\"tab('three')\"><!-- Consumer provides tab label --></button>\n  </div>\n  <div class=\"tab-panel\" x-bind=\"panel('one')\"><!-- Consumer provides panel content --></div>\n  <div class=\"tab-panel\" x-bind=\"panel('two')\"><!-- Consumer provides panel content --></div>\n  <div class=\"tab-panel\" x-bind=\"panel('three')\"><!-- Consumer provides panel content --></div>\n</div>";

const meta = {
  title: 'Headless/Tab Bar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
