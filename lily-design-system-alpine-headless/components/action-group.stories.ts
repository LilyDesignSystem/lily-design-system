import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"action-group\" role=\"group\" aria-label=\"\" x-data=\"lilyDropdownMenu(false)\" x-bind=\"root\">\n  <button type=\"button\"><!-- Consumer provides a visible action --></button>\n  <button class=\"action-group-overflow-trigger\" x-bind=\"trigger\" aria-label=\"\" aria-controls=\"action-group-overflow-1\">…</button>\n  <div class=\"action-group-overflow-menu\" id=\"action-group-overflow-1\" aria-label=\"\" x-bind=\"menu\">\n    <button class=\"action-group-overflow-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n    <button class=\"action-group-overflow-item\" x-bind=\"item\"><!-- Consumer provides label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Action Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
