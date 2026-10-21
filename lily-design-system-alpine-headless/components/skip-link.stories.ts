import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SkipLink component -->\n<!--\n  Description: a hidden link for keyboard users to skip to main content\n  HTML tag: <a>\n  CSS class: skip-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n  Usage:\n    <a class=\"skip-link\" aria-label=\"Example\">\n      ...\n    </a>\n-->\n\n<a\n  class=\"skip-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides link text -->\n</a>";

const meta = {
  title: 'Headless/Skip Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
