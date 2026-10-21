import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PaginationLink component -->\n<!--\n  Description: one pagination link in the trail\n  HTML tag: <a>\n  CSS class: pagination-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n-->\n\n<a\n  class=\"pagination-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Pagination Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
