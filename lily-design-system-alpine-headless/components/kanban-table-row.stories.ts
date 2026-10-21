import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KanbanTableRow component -->\n<!--\n  Description: a kanban board table interactive grid row for organizing items by status\n  HTML tag: <tr> wrapped in <table>\n  CSS class: kanban-table-row\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr class=\"kanban-table-row\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tr></table>";

const meta = {
  title: 'Headless/Kanban Table Row',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
