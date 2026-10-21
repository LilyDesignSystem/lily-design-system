import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TaskListItem component -->\n<!--\n  Description: one task item with a checkbox and label\n  HTML tag: <li> wrapped in <ol>\n  CSS class: task-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"task-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Task List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
