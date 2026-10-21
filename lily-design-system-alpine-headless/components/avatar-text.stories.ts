import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AvatarText component -->\n<!--\n  Description: an avatar indicator inner text such as a user name\n  HTML tag: <div>\n  CSS class: avatar-text\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"avatar-text\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"avatar-text\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Avatar Text',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
