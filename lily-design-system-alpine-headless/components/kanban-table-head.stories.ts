import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KanbanTableHead component -->\n<!--\n  Description: a kanban board table interactive grid thead for organizing items by status\n  HTML tag: <thead> wrapped in <table>\n  CSS class: kanban-table-head\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead class=\"kanban-table-head\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</thead></table>";

const meta = {
  title: 'Headless/Kanban Table Head',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
