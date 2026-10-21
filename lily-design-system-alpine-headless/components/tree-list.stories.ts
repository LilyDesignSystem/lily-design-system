import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TreeList component -->\n<!--\n  Description: a hierarchical list with nested expandable items\n  HTML tag: <ol>\n  CSS class: tree-list\n  Keyboard: None (passive element)\n  Accessibility: role=\"tree\", aria-label for accessible name\n  Usage:\n    <ol class=\"tree-list\" role=\"tree\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"tree-list\"\n  role=\"tree\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Tree List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
