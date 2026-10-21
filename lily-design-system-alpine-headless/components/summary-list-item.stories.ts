import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SummaryListItem component -->\n<!--\n  Description: one key-value pair in a summary list\n  HTML tag: <li> wrapped in <ol>\n  CSS class: summary-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"summary-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Summary List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
