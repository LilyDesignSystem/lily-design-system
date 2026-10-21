import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<nav\n  class=\"pagination-nav\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides navigation list -->\n</nav>";

const meta = {
  title: 'Headless/Pagination Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
