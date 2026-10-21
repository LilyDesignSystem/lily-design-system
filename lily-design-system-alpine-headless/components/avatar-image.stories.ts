import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AvatarImage component -->\n<!--\n  Description: an avatar indicator inside image such as a user photo\n  HTML tag: <div>\n  CSS class: avatar-image\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"avatar-image\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"avatar-image\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Avatar Image',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
