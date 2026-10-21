import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TelLink component -->\n<!--\n  Description: a tel hyperlink for a telephone number\n  HTML tag: <a>\n  CSS class: tel-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n  Usage:\n    <a class=\"tel-link\" aria-label=\"Example\">\n      ...\n    </a>\n-->\n\n<a\n  class=\"tel-link\"\n  aria-label=\"\"\n  href=\"tel:\"\n>\n  <!-- Consumer provides link text -->\n</a>";

const meta = {
  title: 'Headless/Tel Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
