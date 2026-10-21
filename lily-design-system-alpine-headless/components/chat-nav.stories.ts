import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ChatNav component -->\n<!--\n  Description: a navigation container for chat information\n  HTML tag: <nav>\n  CSS class: chat-nav\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<nav\n  class=\"chat-nav\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</nav>";

const meta = {
  title: 'Headless/Chat Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
