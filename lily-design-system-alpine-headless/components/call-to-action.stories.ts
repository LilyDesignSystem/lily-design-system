import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CallToAction component -->\n<!--\n  Description: a prominent prompt encouraging user action\n  HTML tag: <div>\n  CSS class: call-to-action\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"call-to-action\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"call-to-action\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Call To Action',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
