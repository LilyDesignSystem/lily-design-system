import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"empty-state\"\n  role=\"group\"\n  aria-label=\"No results\"\n>\n  <h2>Nothing here yet</h2>\n  <p>Try a different search.</p>\n  <button type=\"button\">Clear filters</button>\n</div>";

const meta = {
  title: 'Headless/Empty State',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
