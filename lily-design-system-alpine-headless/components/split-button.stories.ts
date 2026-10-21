import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"split-button\" role=\"group\" aria-label=\"\" x-data=\"lilyDropdownMenu(false)\" x-bind=\"root\">\n  <button class=\"split-button-primary\" type=\"button\"><!-- Consumer provides primary label --></button>\n  <button class=\"split-button-menu-trigger\" x-bind=\"trigger\" aria-label=\"\" aria-controls=\"split-button-menu-1\">\n    <!-- Consumer optionally provides a chevron icon -->\n  </button>\n  <div class=\"split-button-menu\" id=\"split-button-menu-1\" aria-label=\"\" x-bind=\"menu\">\n    <button class=\"split-button-menu-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n    <button class=\"split-button-menu-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Split Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
