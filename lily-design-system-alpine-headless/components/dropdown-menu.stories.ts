import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"dropdown-menu\" x-data=\"lilyDropdownMenu(false)\" x-bind=\"root\">\n  <button class=\"dropdown-menu-trigger\" x-bind=\"trigger\" aria-controls=\"dropdown-menu-1\"><!-- Consumer provides trigger label --></button>\n  <div class=\"dropdown-menu-popup\" id=\"dropdown-menu-1\" aria-label=\"\" x-bind=\"menu\">\n    <button class=\"dropdown-menu-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n    <button class=\"dropdown-menu-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n    <button class=\"dropdown-menu-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Dropdown Menu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
