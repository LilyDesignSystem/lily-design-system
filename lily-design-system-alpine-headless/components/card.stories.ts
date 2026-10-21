import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Card component -->\n<!--\n  Description: a grouped content container with header, body, and footer areas\n  HTML tag: <div>\n  CSS class: card\n  Keyboard: None (passive element)\n  Accessibility: role=\"region\", aria-label for accessible name\n  Usage:\n    <div class=\"card\" role=\"region\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"card\"\n  role=\"region\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Card',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
