import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ContentsListItem component -->\n<!--\n  Description: one contents list item component linking to a page section\n  HTML tag: <li> wrapped in <ol>\n  CSS class: contents-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"contents-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Contents List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
