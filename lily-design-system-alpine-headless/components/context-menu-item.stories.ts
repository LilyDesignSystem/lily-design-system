import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ContextMenuItem component -->\n<!--\n  Description: one item in a context menu\n  HTML tag: <div>\n  CSS class: context-menu-item\n  Keyboard: None (passive element)\n  Accessibility: role=\"menuitem\", aria-label for accessible name\n  Usage:\n    <div class=\"context-menu-item\" role=\"menuitem\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"context-menu-item\"\n  role=\"menuitem\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Context Menu Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
