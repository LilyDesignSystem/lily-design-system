import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BackLink component -->\n<!--\n  Description: a navigation link to return to a previous page\n  HTML tag: <a>\n  CSS class: back-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n  Usage:\n    <a class=\"back-link\" aria-label=\"Example\">\n      ...\n    </a>\n-->\n\n<a\n  class=\"back-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides link text -->\n</a>";

const meta = {
  title: 'Headless/Back Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
