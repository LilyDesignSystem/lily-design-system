import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AvatarGroup component -->\n<!--\n  Description: a group of avatar components\n  HTML tag: <div>\n  CSS class: avatar-group\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"avatar-group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Avatar Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
