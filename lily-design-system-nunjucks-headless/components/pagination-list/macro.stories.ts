import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="pagination-list"></ol>`;

const meta = {
  title: 'Headless/PaginationList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
