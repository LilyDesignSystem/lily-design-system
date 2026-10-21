import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KanbanTableFoot component -->\n<!--\n  Description: a kanban board table interactive grid tfoot for organizing items by status\n  HTML tag: <tfoot> wrapped in <table>\n  CSS class: kanban-table-foot\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tfoot class=\"kanban-table-foot\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tfoot></table>";

const meta = {
  title: 'Headless/Kanban Table Foot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
