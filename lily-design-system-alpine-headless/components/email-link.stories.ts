import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EmailLink component -->\n<!--\n  Description: a mailto hyperlink for an email address\n  HTML tag: <a>\n  CSS class: email-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n  Usage:\n    <a class=\"email-link\" aria-label=\"Example\">\n      ...\n    </a>\n-->\n\n<a\n  class=\"email-link\"\n  aria-label=\"\"\n  href=\"mailto:\"\n>\n  <!-- Consumer provides link text -->\n</a>";

const meta = {
  title: 'Headless/Email Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
