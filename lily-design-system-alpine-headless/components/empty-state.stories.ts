import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EmptyState component -->\n<!--\n  Description: placeholder content shown where a list, table or search has nothing to show\n  HTML tag: <div>\n  CSS class: empty-state\n  Keyboard: None (passive element); any action is a consumer-supplied button/link\n  Accessibility: when a label is given, role=\"group\" and aria-label name the region; without\n    a label the div carries no role. No icon is bundled; heading, text and action are consumer-supplied.\n  Usage:\n    <div class=\"empty-state\" role=\"group\" aria-label=\"No results\">\n      <h2>Nothing here yet</h2>\n      <p>Explanation</p>\n      <a href=\"/new\">Create one</a>\n    </div>\n-->\n\n<div\n  class=\"empty-state\"\n  role=\"group\"\n  aria-label=\"No results\"\n>\n  <h2>Nothing here yet</h2>\n  <p>Try a different search.</p>\n  <button type=\"button\">Clear filters</button>\n</div>";

const meta = {
  title: 'Headless/Empty State',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
