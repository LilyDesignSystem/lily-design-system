import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ChatListItem component -->\n<!--\n  Description: one chat list item\n  HTML tag: <li>\n  CSS class: chat-list-item\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<li\n  class=\"chat-list-item\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</li>";

const meta = {
  title: 'Headless/Chat List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
