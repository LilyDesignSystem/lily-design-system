import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyContextMenu()\">\n  <div class=\"context-menu-target\" tabindex=\"0\" x-bind=\"target\"><!-- Consumer provides the region that owns the menu --></div>\n  <div class=\"context-menu\" aria-label=\"\" x-bind=\"menu\">\n    <button class=\"context-menu-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n    <button class=\"context-menu-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Context Menu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
