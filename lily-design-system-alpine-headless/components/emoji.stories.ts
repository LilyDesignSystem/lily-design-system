import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Emoji component -->\n<!--\n  Description: a single emoji character with accessible name\n  HTML tag: <span>\n  CSS class: emoji\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"emoji\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"emoji\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Emoji',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
