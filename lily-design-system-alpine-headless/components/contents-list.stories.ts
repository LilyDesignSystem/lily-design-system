import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ContentsList component -->\n<!--\n  Description: an ordered list of contents list item components\n  HTML tag: <ol>\n  CSS class: contents-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"contents-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"contents-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Contents List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
