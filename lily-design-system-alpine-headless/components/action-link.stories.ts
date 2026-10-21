import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ActionLink component -->\n<!--\n  Description: a hyperlink styled as an action trigger\n  HTML tag: <a>\n  CSS class: action-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n  Usage:\n    <a class=\"action-link\" aria-label=\"Example\">\n      ...\n    </a>\n-->\n\n<a\n  class=\"action-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides link text -->\n</a>";

const meta = {
  title: 'Headless/Action Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
