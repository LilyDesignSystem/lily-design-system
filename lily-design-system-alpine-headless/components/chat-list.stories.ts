import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ChatList component -->\n<!--\n  Description: an ordered list of chat list items\n  HTML tag: <ol>\n  CSS class: chat-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<ol\n  class=\"chat-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</ol>";

const meta = {
  title: 'Headless/Chat List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
