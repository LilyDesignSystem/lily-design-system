import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KanbanTableTh component -->\n<!--\n  Description: a kanban board table interactive grid column for organizing items by status\n  HTML tag: <th> wrapped in <table><thead><tr>\n  CSS class: kanban-table-th\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead><tr><th class=\"kanban-table-th\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</th></tr></thead></table>";

const meta = {
  title: 'Headless/Kanban Table TH',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
