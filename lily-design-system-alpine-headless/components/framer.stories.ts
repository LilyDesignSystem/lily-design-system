import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Framer component -->\n<!--\n  Description: a container for framed content\n  HTML tag: <div>\n  CSS class: framer\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"framer\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Framer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
