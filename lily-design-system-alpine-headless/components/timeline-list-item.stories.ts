import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TimelineListItem component -->\n<!--\n  Description: one event in a timeline list\n  HTML tag: <li> wrapped in <ol>\n  CSS class: timeline-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"timeline-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Timeline List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
