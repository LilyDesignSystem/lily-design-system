import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ScrollBar component -->\n<!--\n  Description: a custom scrollbar element\n  HTML tag: <div>\n  CSS class: scroll-bar\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"scroll-bar\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"scroll-bar\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Scroll Bar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
