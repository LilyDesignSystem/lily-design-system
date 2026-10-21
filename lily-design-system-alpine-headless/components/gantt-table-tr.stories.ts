import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GanttTableTr component -->\n<!--\n  Description: a Gantt chart table interactive grid row for planning schedule visualization\n  HTML tag: <tr> wrapped in <table>\n  CSS class: gantt-table-tr\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr class=\"gantt-table-tr\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tr></table>";

const meta = {
  title: 'Headless/Gantt Table Tr',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
