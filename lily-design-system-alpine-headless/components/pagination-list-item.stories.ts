import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PaginationListItem component -->\n<!--\n  Description: one page link in a pagination list\n  HTML tag: <li> wrapped in <ol>\n  CSS class: pagination-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"pagination-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Pagination List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
