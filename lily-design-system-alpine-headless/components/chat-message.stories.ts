import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ChatMessage component -->\n<!--\n  Description: a chat message\n  HTML tag: <article>\n  CSS class: chat-message\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<article\n  class=\"chat-message\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</article>";

const meta = {
  title: 'Headless/Chat Message',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
