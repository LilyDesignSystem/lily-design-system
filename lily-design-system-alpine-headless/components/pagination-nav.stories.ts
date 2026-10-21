import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PaginationNav component -->\n<!--\n  Description: navigation container for page navigation links\n  HTML tag: <nav>\n  CSS class: pagination-nav\n  Keyboard: None (passive element)\n  Accessibility: Implicit navigation role, aria-label for accessible name\n  Usage:\n    <nav class=\"pagination-nav\" aria-label=\"Example\">\n      ...\n    </nav>\n-->\n\n<nav\n  class=\"pagination-nav\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides navigation list -->\n</nav>";

const meta = {
  title: 'Headless/Pagination Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
