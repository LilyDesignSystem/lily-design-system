import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PaginationList component -->\n<!--\n  Description: an ordered list of page navigation links\n  HTML tag: <ol>\n  CSS class: pagination-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"pagination-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"pagination-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Pagination List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
