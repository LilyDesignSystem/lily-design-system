import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GanttTableTfoot component -->\n<!--\n  Description: a Gantt chart table interactive grid tfoot for planning schedule visualization\n  HTML tag: <tfoot> wrapped in <table>\n  CSS class: gantt-table-tfoot\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tfoot class=\"gantt-table-tfoot\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tfoot></table>";

const meta = {
  title: 'Headless/Gantt Table Tfoot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
