import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Always inside a lilyTabs scope: see tab-bar.html -->\n<div x-data=\"lilyTabs('one')\">\n  <div role=\"tablist\" aria-label=\"\" x-bind=\"tablist\">\n    <button class=\"tab-bar-button\" x-bind=\"tab('one')\"><!-- Consumer provides tab label --></button>\n  </div>\n  <div x-bind=\"panel('one')\"></div>\n</div>";

const meta = {
  title: 'Headless/Tab Bar Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
