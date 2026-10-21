import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MenuItem component -->\n<!--\n  Description: one item in a menu\n  HTML tag: <div>\n  CSS class: menu-item\n  Keyboard: None (passive element)\n  Accessibility: role=\"menuitem\", aria-label for accessible name\n  Usage:\n    <div class=\"menu-item\" role=\"menuitem\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"menu-item\"\n  role=\"menuitem\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Menu Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
