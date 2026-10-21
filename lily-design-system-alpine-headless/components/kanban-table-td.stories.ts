import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KanbanTableTd component -->\n<!--\n  Description: kanban board table interactive grid data cell for organizing items by status\n  HTML tag: <td> wrapped in <table><tr>\n  CSS class: kanban-table-td\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr><td class=\"kanban-table-td\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</td></tr></table>";

const meta = {
  title: 'Headless/Kanban Table TD',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
