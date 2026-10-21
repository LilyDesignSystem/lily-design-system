import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KanbanTable component -->\n<!--\n  Description: a kanban board table interactive grid for organizing items by status\n  HTML tag: <table>\n  CSS class: kanban-table\n  Keyboard: None (passive element)\n  Accessibility: Implicit table role, aria-label for accessible name\n  Usage:\n    <table class=\"kanban-table\" aria-label=\"Example\">\n      ...\n    </table>\n-->\n\n<table\n  class=\"kanban-table\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides thead, tbody, tfoot -->\n</table>";

const meta = {
  title: 'Headless/Kanban Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
