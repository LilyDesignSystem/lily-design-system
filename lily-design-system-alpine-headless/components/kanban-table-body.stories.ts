import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KanbanTableBody component -->\n<!--\n  Description: a kanban board table interactive grid tbody for organizing items by status\n  HTML tag: <tbody> wrapped in <table>\n  CSS class: kanban-table-body\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tbody class=\"kanban-table-body\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tbody></table>";

const meta = {
  title: 'Headless/Kanban Table Body',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
