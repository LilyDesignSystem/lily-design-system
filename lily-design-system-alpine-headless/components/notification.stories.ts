import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Notification component -->\n<!--\n  Description: a brief message about an event or update\n  HTML tag: <div>\n  CSS class: notification\n  Keyboard: None (passive element)\n  Accessibility: role=\"alert\", aria-label for accessible name\n  Usage:\n    <div class=\"notification\" role=\"alert\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"notification\"\n  role=\"alert\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Notification',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
