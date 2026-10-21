import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TreeListItem component -->\n<!--\n  Description: one item in a tree navigation list\n  HTML tag: <li> wrapped in <ol>\n  CSS class: tree-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol role=\"tree\"><li class=\"tree-list-item\" role=\"treeitem\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Tree List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
