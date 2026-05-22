import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="pagination-nav" aria-label="Pagination"></nav>`;

const meta = {
  title: 'Headless/PaginationNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
